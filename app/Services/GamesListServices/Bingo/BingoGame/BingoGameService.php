<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;

use App\DTOs\GameEngine\GameEntryDTO;
use App\DTOs\GameEngine\GameInstanceDTO;
use App\DTOs\GameEngine\GameResultDTO;
use App\DTOs\GamesList\BingoGameDTO;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameResult;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;
use App\Services\GameEngine\GameEntries\IGameEntryService;
use App\Services\GameEngine\GameInstances\IGameInstanceService;
use App\Services\GameEngine\GameResults\IGameResultService;
use App\Services\GamesListServices\Bingo\BingoCondition\IBingoConditionService;
use App\Services\GamesListServices\Bingo\BingoMatch\IBingoMatchService;
use App\Services\Pagination\IPaginationService;
use App\Enums\GameEngine\GameStatus;
use App\Enums\GameEngine\GameResultStatus;
use Illuminate\Support\Facades\DB;

class BingoGameService implements IBingoGameService
{
    public const ANSWERS_SIZE = 40;
    public const SLUG = 'bingo-football';

    public function __construct(
        private readonly IPaginationService $paginationService,
        private readonly IBingoMatchService $matchService,
        private readonly IBingoConditionService $conditionService,
        private readonly IGameInstanceService $instanceService,
        private readonly IGameResultService $resultService,
        private readonly IGameEntryService $entryService,

    ) {
    }

    public function getById(User $user, int $id): BingoGame
    {
        return BingoGame::findOrFail($id)->load([
            'conditions',
        ]);
    }

    public function create(User $user, BingoGameDTO $dto): BingoGame
    {
        return DB::transaction(function () use ($user, $dto) {
            $game = Game::where('slug', self::SLUG)->firstOrFail();

            $gameInstance = $this->instanceService->create(new GameInstanceDTO(
                gameId: $game->id,
                status: GameStatus::ACTIVE,
                startAt: now(),
            ));

            $this->entryService->create(new GameEntryDTO(
                gameInstanceId: $gameInstance->id,
                userId: $user->id,
            ));

            $bingoGame = BingoGame::create([
                'game_instance_id' => $gameInstance->id,
                'size' => $dto->size,
                'difficulty' => $dto->difficulty,
                'remaining_answers' => self::ANSWERS_SIZE,
            ]);

            $this->conditionService->createGameConditions($bingoGame);
            $this->matchService->createGameMatches($bingoGame, self::ANSWERS_SIZE);

            return $bingoGame->load(['conditions']);
        });
    }

    public function check(User $user, int $gameId, int $conditionPos): BingoCondition
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        $this->ensureActiveAndNotFinished($user, $bingoGame);

        $bingoCondition = $this->conditionService->getByBingoGameIdAndPosition($bingoGame->id, $conditionPos);
        $bingoMatch = $this->matchService->getCurrentMatch($bingoGame);

        $accepted = $this->conditionService->validateMatchAgainstCondition($bingoCondition, $bingoMatch);

        if ($accepted) {
            $bingoCondition->update([
                'bingo_match_id' => $bingoMatch->id,
                'is_marked' => true,
            ]);
            $bingoCondition->refresh()->load(['match.player']);
        } else {
            $this->decrementRemainingAnswers($bingoGame);
        }

        $this->handleGameCompletion($user, $bingoGame);

        return $bingoCondition;
    }

    public function nextMatch(User $user, int $gameId): BingoMatch
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        $this->ensureActiveAndNotFinished($user, $bingoGame);

        $nextMatch = $this->matchService->getNextMatch($bingoGame);
        $this->decrementRemainingAnswers($bingoGame);

        return $nextMatch;
    }

    public function results(User $user, int $gameId): GameResult
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);

        if ($bingoGame->instance->status !== GameStatus::FINISHED) {
            if ($this->checkGameFinished($bingoGame)) {
                $this->finishGame($user, $bingoGame);
            } else {
                abort(400, "Game is still Active");
            }
        }

        $gameEntry = GameEntry::where('user_id', $user->id)
            ->where('game_instance_id', $bingoGame->instance->id)
            ->firstOrFail();

        return GameResult::where('game_entry_id', $gameEntry->id)->firstOrFail();
    }

    // --- Private Helper Methods ---

    private function ensureActiveAndNotFinished(User $user, BingoGame $bingoGame): void
    {
        if ($bingoGame->instance->status !== GameStatus::ACTIVE) {
            abort(400, "Game is not Active");
        }

        if ($this->checkGameFinished($bingoGame)) {
            $this->finishGame($user, $bingoGame);
            abort(400, "Game is finished");
        }
    }

    private function handleGameCompletion(User $user, BingoGame $bingoGame): void
    {
        if ($this->checkGameFinished($bingoGame)) {
            $this->finishGame($user, $bingoGame);
        }
    }

    private function decrementRemainingAnswers(BingoGame $game): void
    {
        $game->update([
            'remaining_answers' => max(0, $game->remaining_answers - 1),
        ]);
    }

    private function checkGameFinished(BingoGame $bingoGame): bool
    {
        $unmarkedCount = $bingoGame->conditions()->where('is_marked', false)->count();
        return ($bingoGame->remaining_answers <= 0) || ($unmarkedCount === 0);
    }

    private function finishGame(User $user, BingoGame $game, GameStatus $gameStatus = GameStatus::FINISHED): void
    {
        if ($game->instance->status === GameStatus::FINISHED) {
            abort(400, "Game is already finished");
        }

        $isWon = $this->evaluateBingoResult($game);

        $game->instance->update([
            'status' => $gameStatus->value,
            'end_at' => now(),
        ]);

        $gameEntry = GameEntry::where('user_id', $user->id)
            ->where('game_instance_id', $game->instance->id)
            ->firstOrFail();

        GameResult::updateOrCreate(
            ['game_entry_id' => $gameEntry->id],
            [
                'status' => $isWon ? GameResultStatus::WON : GameResultStatus::LOST,
                'score' => $this->evaluateBingoScore($game),
                'is_winner' => $isWon,
            ]
        );
    }

    private function evaluateBingoResult(BingoGame $bingoGame): bool
    {
        $markedCount = $bingoGame->conditions()->where('is_marked', true)->count();
        return $markedCount === ($bingoGame->size * $bingoGame->size);
    }

    private function evaluateBingoScore(BingoGame $bingoGame): int
    {
        $markedCount = $bingoGame->conditions()->where('is_marked', true)->count();
        $totalCells = $bingoGame->size * $bingoGame->size;

        $startAt = $bingoGame->instance->start_at;
        $endAt = $bingoGame->instance->end_at ?? now();

        $completionRate = $markedCount / $totalCells;
        $preScore = ($completionRate === 1.0) ? 1000 : (int) round(1000 * pow($completionRate, 3));

        $timeTaken = $endAt->diffInSeconds($startAt);
        $score = ceil($preScore - ($timeTaken / 10));

        return (int) max(0, $score);
    }
}