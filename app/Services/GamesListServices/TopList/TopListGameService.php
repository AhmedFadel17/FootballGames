<?php
namespace App\Services\GamesListServices\TopList;

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
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TopListGameService implements ITopListGameService
{
    const SLUG = 'top-list';
    const MAX_ATTEMPTS = 3;

    public function create(TopListGameDTO $dto): TopListGame
    {
        return DB::transaction(function () use ($dto) {
            $topListGame = TopListGame::create([
                'title' => $dto->title,
                'description' => $dto->description,
                'items_type' => $dto->items_type,
                'total_items' => count((array) $dto->items),
                'difficulty' => $dto->difficulty ?? GameDifficulty::EASY->value,
            ]);

            foreach ($dto->items as $item) {
                TopListItem::create([
                    'top_list_game_id' => $topListGame->id,
                    'rank' => $item['rank'] ?? $item['pos'],
                    'object_id' => $item['id'] ?? $item['object_id'],
                    'display_value' => $item['display_value'] ?? null,
                ]);
            }

            return $topListGame->load('items');
        });
    }

    public function startGame(User $user, TopListGameInstanceDTO $dto): TopListGameInstance
    {
        return DB::transaction(function () use ($user, $dto) {
            $difficulty = GameDifficulty::tryFrom($dto->difficulty) ?? GameDifficulty::EASY;
            $game = Game::where('slug', self::SLUG)->firstOrFail();

            $question = TopListGame::where('difficulty', $difficulty->value)
                ->where('is_active', true)
                ->inRandomOrder()
                ->firstOrFail();

            $gameInstance = GameInstance::create([
                'game_id' => $game->id,
                'status' => GameStatus::ACTIVE,
                'start_at' => now(),
            ]);

            GameEntry::create([
                'game_instance_id' => $gameInstance->id,
                'user_id' => $user->id,
            ]);

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

            $gameEntry = GameEntry::where('game_instance_id', $gameInstance->id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $masterQuestion = $instance->masterQuestion;

            // Prevent duplicate attempts for the exact same object
            $alreadyGuessed = TopListGuess::where('top_list_game_instance_id', $instance->id)
                ->where('game_entry_id', $gameEntry->id)
                ->where('object_id', $objectId)
                ->exists();

            if ($alreadyGuessed) {
                throw new HttpException(422, "You have already guessed this item in this game.");
            }

            // Verify if object exists in target list items
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

            // Check if game finish conditions are met after recording this guess
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

        $isWon = $this->evaluateGameResult($masterQuestion, $gameEntry);

        $gameInstance->update([
            'status' => $gameStatus->value,
            'end_at' => now(),
        ]);

        $status = $isWon ? GameResultStatus::WON : GameResultStatus::LOST;
        $score = $this->evaluateGameScore($gameInstance, $masterQuestion, $gameEntry);

        GameResult::updateOrCreate(
            ['game_entry_id' => $gameEntry->id],
            [
                'status' => $status->value,
                'score' => $score,
                'is_winner' => $isWon,
            ]
        );
    }

    private function evaluateGameResult(TopListGame $masterQuestion, GameEntry $entry): bool
    {
        $correctCount = TopListGuess::where('game_entry_id', $entry->id)
            ->where('is_correct', true)
            ->count();

        return $correctCount === $masterQuestion->total_items;
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

    private function evaluateGameScore(GameInstance $gameInstance, TopListGame $masterQuestion, GameEntry $entry): int
    {
        $correct = TopListGuess::where('game_entry_id', $entry->id)
            ->where('is_correct', true)
            ->count();

        $size = $masterQuestion->total_items;
        if ($size === 0)
            return 0;

        $startAt = $gameInstance->start_at;
        $endAt = $gameInstance->end_at ?? now();

        $completionRate = $correct / $size;
        $preScore = ($completionRate == 1) ? 1000 : (int) round(1000 * pow($completionRate, 3));

        $timeTaken = $endAt->diffInSeconds($startAt);
        $score = ceil($preScore - ($timeTaken / 10));

        return (int) max(0, $score);
    }
}