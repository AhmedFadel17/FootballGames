<?php

namespace App\Services\GameEngine\GameResults;

use App\DTOs\GameEngine\GameResultDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Enums\GameEngine\GameStatus;
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
}
