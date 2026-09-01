<?php
namespace App\Services\GamesListServices\TopList\TopListGameInstance;

use App\DTOs\GameEngine\GameEntryDTO;
use App\DTOs\GameEngine\GameInstanceDTO;
use App\DTOs\GameEngine\GameResultDTO;
use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\GamesList\TopList\TopListGameInstanceDTO;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameInstance;
use App\Models\GameEngine\GameResult;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListGameInstance;
use App\Models\GamesList\TopList\TopListGuess;
use App\Models\GamesList\TopList\TopListItem;
use App\Models\User;
use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GameEngine\GameResultStatus;
use App\Enums\GameEngine\GameStatus;
use App\Services\GameEngine\GameEntries\IGameEntryService;
use App\Services\GameEngine\GameInstances\IGameInstanceService;
use App\Services\GameEngine\GameResults\IGameResultService;
use App\Services\GamesListServices\TopList\TopListGame\ITopListGameService;
use App\Services\Infra\PlayerProgress\IPlayerProgressService;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TopListGameInstanceService implements ITopListGameInstanceService
{
    const SLUG = 'top-list';
    const MAX_ATTEMPTS = 3;
    public function __construct(
        private readonly ITopListGameService $_topListGameService,
        private readonly IGameInstanceService $_gameInstanceService,
        private readonly IGameEntryService $_gameEntryService,
        private readonly IPlayerProgressService $playerProgressService,
        private readonly IGameResultService $gameResultService,
    ) {
    }


    public function startGame(User $user, TopListGameInstanceDTO $dto): TopListGameInstance
    {
        return DB::transaction(function () use ($user, $dto) {
            $difficulty = GameDifficulty::tryFrom($dto->difficulty) ?? GameDifficulty::EASY;
            $game = Game::where('slug', self::SLUG)->firstOrFail();
            if (!$this->playerProgressService->consumeStamina($user, $game->stamina_cost)) {
                abort(400, "You don't have enough stamina to play this game.");
            }

            $question = $this->_topListGameService->getRandom($user, $difficulty);
            if ($question === null) {
                throw new HttpException(404, "No unplayed games found for this difficulty.");
            }

            $gameInstance = $this->_gameInstanceService->create(
                new GameInstanceDTO(
                    gameId: $game->id,
                    status: GameStatus::ACTIVE,
                    maxPlayers: $game->max_players,
                    startAt: now(),
                )
            );

            $this->_gameEntryService->create(
                new GameEntryDTO(
                    gameInstanceId: $gameInstance->id,
                    userId: $user->id,
                )
            );

            $topListGameInstance = TopListGameInstance::create([
                'game_instance_id' => $gameInstance->id,
                'top_list_game_id' => $question->id,
                'max_attempts' => self::MAX_ATTEMPTS,
            ]);

            return $topListGameInstance->load(['masterQuestion.items.object', 'guesses.object']);
        });
    }

    public function getGameInstanceDetails(int $id): TopListGameInstance
    {
        return TopListGameInstance::with(['masterQuestion.items.object', 'guesses.object'])
            ->findOrFail($id);
    }

    public function check(User $user, int $topListGameInstanceId, int $objectId): TopListGuess
    {
        return DB::transaction(function () use ($user, $topListGameInstanceId, $objectId) {
            $instance = TopListGameInstance::with(['gameInstance', 'masterQuestion'])
                ->findOrFail($topListGameInstanceId);

            $gameInstance = $instance->gameInstance;

            if ($gameInstance->status === GameStatus::FINISHED) {
                throw new HttpException(400, "Game session is already finished.");
            }

            $gameEntry = $this->_gameEntryService->getByUserAndGameInstance($user->id, $gameInstance->id);
            if ($gameEntry === null) {
                throw new HttpException(404, "Game entry not found.");
            }

            $masterQuestion = $instance->masterQuestion;

            $alreadyGuessed = TopListGuess::where('top_list_game_instance_id', $instance->id)
                ->where('game_entry_id', $gameEntry->id)
                ->where('object_id', $objectId)
                ->exists();

            if ($alreadyGuessed) {
                throw new HttpException(422, "You have already guessed this item in this game.");
            }

            $matchedItem = TopListItem::where('top_list_game_id', $masterQuestion->id)
                ->where('object_id', $objectId)
                ->first();

            $isCorrect = !is_null($matchedItem);
            $matchedRank = $matchedItem?->rank;

            $guess = TopListGuess::create([
                'top_list_game_instance_id' => $instance->id,
                'game_entry_id' => $gameEntry->id,
                'object_id' => $objectId,
                'object_type' => $masterQuestion->items_type,
                'is_correct' => $isCorrect,
                'matched_rank' => $matchedRank,
            ]);

            if ($this->checkGameFinished($instance, $masterQuestion, $gameEntry)) {
                $this->finishGame($gameInstance, $gameEntry, $masterQuestion, $instance);
            }

            return $guess->load('object');
        });
    }

    private function finishGame(
        GameInstance $gameInstance,
        GameEntry $gameEntry,
        TopListGame $masterQuestion,
        TopListGameInstance $instance,
        GameStatus $gameStatus = GameStatus::FINISHED
    ): void {
        if ($gameInstance->status === GameStatus::FINISHED) {
            return;
        }

        $now = now();
        $guesses = TopListGuess::where('game_entry_id', $gameEntry->id)->get();
        $correctCount = $guesses->where('is_correct', true)->count();

        $isWon = ($correctCount === $masterQuestion->total_items);
        $durationSeconds = (int) $now->diffInSeconds($gameInstance->start_at);
        $status = $isWon ? GameResultStatus::WON : GameResultStatus::LOST;
        $game = $gameInstance->game;

        [$earnedXp, $earnedCoins, $earnedPoints, $score] = $this->gameResultService->calculateRewards(
            game: $game,
            isWon: $isWon,
            durationSeconds: $durationSeconds,
            correctCount: $correctCount,
            totalItems: $masterQuestion->total_items,
            difficulty: $masterQuestion->difficulty
        );

        $gameInstance->update([
            'status' => $gameStatus->value,
            'end_at' => $now,
        ]);

        $this->gameResultService->create(
            new GameResultDTO(
                gameEntryId: $gameEntry->id,
                status: $status,
                score: $score,
                isWinner: $isWon,
                rank: 1,
                durationSeconds: $durationSeconds,
                earnedXp: $earnedXp,
                earnedCoins: $earnedCoins,
                earnedPoints: $earnedPoints,
            )
        );

        $this->playerProgressService->rewardPlayer(
            $gameEntry->user,
            $earnedXp,
            $earnedCoins,
            $earnedPoints
        );
    }

    private function checkGameFinished(TopListGameInstance $instance, TopListGame $masterQuestion, GameEntry $entry): bool
    {
        $guesses = TopListGuess::where('top_list_game_instance_id', $instance->id)
            ->where('game_entry_id', $entry->id);

        $correct = (clone $guesses)->where('is_correct', true)->count();
        $wrong = (clone $guesses)->where('is_correct', false)->count();

        $maxAttempts = $instance->max_attempts ?? self::MAX_ATTEMPTS;

        return $wrong >= $maxAttempts || $correct >= $masterQuestion->total_items;
    }
}