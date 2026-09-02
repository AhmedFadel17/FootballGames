<?php
namespace App\Services\GamesListServices\TopList\TopListGameInstance;

use App\DTOs\GamesList\TopList\TopListGameInstanceDTO;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameInstance;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListGameInstance;
use App\Models\GamesList\TopList\TopListGuess;
use App\Models\GamesList\TopList\TopListItem;
use App\Models\User;
use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GameEngine\GameStatus;
use App\Services\GameEngine\GameInstances\IGameInstanceService;
use App\Services\GamesListServices\TopList\TopListGame\ITopListGameService;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TopListGameInstanceService implements ITopListGameInstanceService
{
    const SLUG = 'top-list';
    const MAX_ATTEMPTS = 3;
    public function __construct(
        private readonly ITopListGameService $_topListGameService,
        private readonly IGameInstanceService $gameInstanceService,
    ) {
    }

    public function startGame(User $user, TopListGameInstanceDTO $dto): TopListGameInstance
    {
        return DB::transaction(function () use ($user, $dto) {
            $difficulty = GameDifficulty::tryFrom($dto->difficulty) ?? GameDifficulty::EASY;
            $game = Game::where('slug', self::SLUG)->firstOrFail();

            $question = $this->_topListGameService->getRandom($user, $difficulty);
            if ($question === null) {
                throw new HttpException(404, "No unplayed games found for this difficulty.");
            }
            [$gameInstance, $gameEntry] = $this->gameInstanceService->startSession($user, $game);

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

            $gameEntry = $gameInstance->entries->where('user_id', $user->id)->first();
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
                $this->finishGame($gameInstance, $gameEntry, $masterQuestion);
            }

            return $guess->load('object');
        });
    }

    private function finishGame(
        GameInstance $gameInstance,
        GameEntry $gameEntry,
        TopListGame $masterQuestion
    ): void {
        $now = now();
        $guesses = TopListGuess::where('game_entry_id', $gameEntry->id)->get();
        $correctCount = $guesses->where('is_correct', true)->count();

        $isWon = ($correctCount === $masterQuestion->total_items);
        $durationSeconds = (int) $now->diffInSeconds($gameInstance->start_at);

        $this->gameInstanceService->finishSession(
            gameInstance: $gameInstance,
            gameEntry: $gameEntry,
            isWon: $isWon,
            correctCount: $correctCount,
            totalItems: $masterQuestion->total_items,
            durationSeconds: $durationSeconds,
            difficulty: $masterQuestion->difficulty
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