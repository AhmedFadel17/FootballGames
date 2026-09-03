<?php

namespace App\Services\GamesListServices\Bingo\BingoGameInstance;

use App\DTOs\GamesList\Bingo\BingoGameInstanceDTO;
use App\DTOs\GamesList\Bingo\BingoGameDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameInstance;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoGameInstance;
use App\Models\GamesList\Bingo\BingoGuess;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;
use App\Services\GameEngine\GameInstances\IGameInstanceService;
use App\Services\GamesListServices\Bingo\BingoCondition\IBingoConditionService;
use App\Services\GamesListServices\Bingo\BingoGame\IBingoGameService;
use App\Services\GamesListServices\Bingo\BingoMatch\IBingoMatchService;
use App\Services\Pagination\IPaginationService;
use App\Enums\GameEngine\GameStatus;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class BingoGameInstanceService implements IBingoGameInstanceService
{
    public const ANSWERS_SIZE = 40;
    public const SLUG = 'bingo-football';

    public function __construct(
        private readonly IPaginationService $paginationService,
        private readonly IBingoMatchService $matchService,
        private readonly IBingoConditionService $conditionService,
        private readonly IGameInstanceService $instanceService,
        private readonly IBingoGameService $bingoGameService,
    ) {
    }

    public function getById(User $user, int $id): BingoGameInstance
    {
        return BingoGameInstance::findOrFail($id)->load([
            'bingoGame.conditions.objectable',
            'bingoGame.matches.player',
            'guesses.condition.objectable',
            'guesses.match.player',
        ]);
    }

    public function startGame(User $user, BingoGameInstanceDTO $dto): BingoGameInstance
    {
        return DB::transaction(function () use ($user, $dto) {
            $game = Game::where('slug', self::SLUG)->firstOrFail();
            $difficulty = GameDifficulty::tryFrom($dto->difficulty) ?? GameDifficulty::EASY;

            $bingoGame = $this->bingoGameService->getRandom($user, $difficulty, $dto->size);
            if ($bingoGame === null) {
                $bingoGame = $this->bingoGameService->create(new BingoGameDTO(
                    difficulty: $dto->difficulty,
                    size: $dto->size,
                ));
            }

            [$gameInstance, $gameEntry] = $this->instanceService->startSession($user, $game);

            $bingoGameInstance = BingoGameInstance::create([
                'game_instance_id' => $gameInstance->id,
                'bingo_game_id' => $bingoGame->id,
                'remaining_answers' => $bingoGame->total_answers,
                'current_match_pos' => 0,
            ]);

            return $bingoGameInstance->load([
                'bingoGame.conditions.objectable',
                'bingoGame.matches.player',
                'guesses',
            ]);
        });
    }

    public function check(User $user, int $gameInstanceId, int $conditionPos): array
    {
        return DB::transaction(function () use ($user, $gameInstanceId, $conditionPos) {
            $instance = BingoGameInstance::with(['gameInstance.entries', 'bingoGame'])
                ->findOrFail($gameInstanceId);

            $gameInstance = $instance->gameInstance;

            if ($gameInstance->status === GameStatus::FINISHED) {
                throw new HttpException(400, "Game session is already finished.");
            }

            $gameEntry = $gameInstance->entries->where('user_id', $user->id)->first();
            if ($gameEntry === null) {
                throw new HttpException(404, "Game entry not found.");
            }

            if ($instance->remaining_answers <= 0) {
                throw new HttpException(400, "No remaining answers.");
            }

            $bingoGame = $instance->bingoGame;
            $bingoCondition = $this->conditionService->getByBingoGameIdAndPosition($bingoGame->id, $conditionPos);

            // Check if this condition is already solved in this instance
            $alreadySolved = BingoGuess::where('bingo_game_instance_id', $instance->id)
                ->where('bingo_condition_id', $bingoCondition->id)
                ->where('is_correct', true)
                ->exists();

            if ($alreadySolved) {
                throw new HttpException(400, "This condition has already been solved.");
            }

            $bingoMatch = $this->matchService->getCurrentMatch($instance);
            if ($bingoMatch === null) {
                throw new HttpException(400, "No more matches available in this game.");
            }

            $isCorrect = $this->conditionService->validateMatchAgainstCondition($bingoCondition, $bingoMatch);

            $guess = BingoGuess::create([
                'bingo_game_instance_id' => $instance->id,
                'game_entry_id' => $gameEntry->id,
                'bingo_condition_id' => $bingoCondition->id,
                'bingo_match_id' => $bingoMatch->id,
                'is_correct' => $isCorrect,
            ]);

            $nextMatch = null;
            $instance->increment('current_match_pos');
            $isComplete = false;
            if ($isCorrect) {
                // Correct: advance match position, do NOT decrement remaining_answers
                $instance->decrement('remaining_answers');
                $isComplete = $this->checkGameFinished($instance);
                if ($isComplete) {
                    $this->finishGame($gameInstance, $gameEntry, $bingoGame);
                } else {
                    $nextMatch = $this->matchService->getCurrentMatch($instance->fresh());
                }
            } else {
                // Incorrect: decrement remaining_answers by 1, do NOT advance current_match_pos
                $instance->decrement('remaining_answers', 2);
                $isComplete = $this->checkGameFinished($instance);
                if ($isComplete) {
                    $this->finishGame($gameInstance, $gameEntry, $bingoGame);
                } else {
                    $nextMatch = $bingoMatch;
                }
            }

            $guess->next_match = $nextMatch;
            return [
                'guess' => $guess->load(['condition.objectable', 'match.player', 'gameInstance']),
                'is_complete' => $isComplete,
            ];
        });
    }

    public function skip(User $user, int $gameId): array
    {
        return DB::transaction(function () use ($user, $gameId) {
            $instance = BingoGameInstance::with(['gameInstance.entries', 'bingoGame'])
                ->findOrFail($gameId);

            $gameInstance = $instance->gameInstance;
            if ($gameInstance->status === GameStatus::FINISHED) {
                throw new HttpException(400, "Game session is already finished.");
            }

            $gameEntry = $gameInstance->entries->where('user_id', $user->id)->first();
            if ($gameEntry === null) {
                throw new HttpException(404, "Game entry not found.");
            }

            if ($instance->remaining_answers <= 0) {
                throw new HttpException(400, "No remaining answers.");
            }

            $instance->decrement('remaining_answers');
            $instance->increment('current_match_pos');

            $isComplete = $this->checkGameFinished($instance);
            if ($isComplete) {
                $this->finishGame($gameInstance, $gameEntry, $instance->bingoGame);
            }

            return [
                "match" => $isComplete ? null : $this->matchService->getCurrentMatch($instance->fresh()),
                "is_complete" => $isComplete
            ];
        });
    }

    public function getCurrentMatch(User $user, int $gameId): ?BingoMatch
    {
        $instance = BingoGameInstance::with('bingoGame')->findOrFail($gameId);
        return $this->matchService->getCurrentMatch($instance);
    }

    public function nextMatch(User $user, int $gameId): ?BingoMatch
    {
        return $this->getCurrentMatch($user, $gameId);
    }

    private function checkGameFinished(BingoGameInstance $bingoGameInstance): bool
    {
        $correctGuesses = $bingoGameInstance->guesses()->where('is_correct', true)->count();
        $totalCells = $bingoGameInstance->bingoGame->size * $bingoGameInstance->bingoGame->size;
        $totalMatches = $bingoGameInstance->bingoGame->total_answers;

        return $correctGuesses >= $totalCells
            || $bingoGameInstance->remaining_answers <= 0
            || $bingoGameInstance->current_match_pos >= $totalMatches;
    }

    private function finishGame(
        GameInstance $gameInstance,
        GameEntry $gameEntry,
        BingoGame $bingoGame
    ): void {
        $guesses = BingoGuess::where('game_entry_id', $gameEntry->id)->get();
        $correctCount = $guesses->where('is_correct', true)->count();
        $totalItems = $bingoGame->size * $bingoGame->size;
        $isWon = $correctCount >= $totalItems;
        $now = now();
        $durationSeconds = (int) $now->diffInSeconds($gameInstance->start_at);

        $this->instanceService->finishSession(
            gameInstance: $gameInstance,
            gameEntry: $gameEntry,
            isWon: $isWon,
            correctCount: $correctCount,
            totalItems: $totalItems,
            durationSeconds: $durationSeconds,
            difficulty: $bingoGame->difficulty
        );

    }
}