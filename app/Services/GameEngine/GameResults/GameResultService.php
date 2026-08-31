<?php

namespace App\Services\GameEngine\GameResults;

use App\DTOs\GameEngine\GameResultDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GameEngine\GameStatus;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameInstance;
use App\Models\GameEngine\GameResult;
use App\Models\User;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GameResultService implements IGameResultService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(GameResult::query(), $dto)
            ->allowFilters(['game_entry_id', 'game_instance_id'])
            ->allowSorts(['id', 'game_entry_id', 'game_instance_id'])
            ->searchable(['id', 'game_entry_id', 'game_instance_id'])
            ->paginate();
    }



    public function getById(int $id): GameResult
    {
        $gameResult = GameResult::findOrFail($id);
        return $gameResult;
    }
    public function getByGameInstanceId(User $user, int $gameInstanceId): GameResult
    {
        $gameInstance = GameInstance::findOrFail($gameInstanceId);

        if ($gameInstance->status == GameStatus::ACTIVE) {
            abort(400, "Game is still Active");
        }
        $entry = GameEntry::where('game_instance_id', $gameInstance->id)->where('user_id', $user->id)->firstOrFail();
        $gameResult = GameResult::where('game_entry_id', $entry->id)->firstOrFail();

        return $gameResult;
    }


    public function create(GameResultDTO $dto): GameResult
    {
        $gameResult = GameResult::create($dto->toArray());
        return $gameResult;
    }

    public function getGameResultsCount(int $gameInstanceId): int
    {
        return GameResult::whereHas('entry', function ($q) use ($gameInstanceId) {
            $q->where('game_instance_id', $gameInstanceId);
        })->count();
    }


    public function update(int $id, GameResultDTO $dto): GameResult
    {
        $gameResult = GameResult::findOrFail($id);
        $gameResult->update($dto->toArray());
        return $gameResult;
    }

    public function delete(int $id): void
    {
        $gameResult = GameResult::findOrFail($id);
        $gameResult->delete();
    }


    public function calculateRewards(
        Game $game,
        bool $isWon,
        int $score,
        int $correctCount,
        int $totalItems,
        GameDifficulty $difficulty
    ): array {
        if ($correctCount === 0 || $totalItems === 0) {
            return [0, 0, 0];
        }

        $completionRate = $correctCount / $totalItems;
        $difficultyMultiplier = $difficulty->multiplier();

        $baseXp = $game->xp_reward ?? 50;
        $baseCoins = $game->coins_reward ?? 20;
        $basePoints = $game->points_reward ?? 10;

        if ($isWon) {
            $earnedXp = (int) round(($baseXp * $difficultyMultiplier) + ($score * 0.10));
            $earnedCoins = (int) round(($baseCoins * $difficultyMultiplier) + ($score * 0.05));
            $earnedPoints = (int) round(($basePoints * $difficultyMultiplier) + $score);
        } else {
            $earnedXp = (int) round(($baseXp * $completionRate) * $difficultyMultiplier);
            $earnedCoins = (int) round(($baseCoins * $completionRate) * $difficultyMultiplier);
            $earnedPoints = (int) round(($basePoints * $completionRate) + ($score * 0.50));
        }

        return [$earnedXp, $earnedCoins, $earnedPoints];
    }
}
