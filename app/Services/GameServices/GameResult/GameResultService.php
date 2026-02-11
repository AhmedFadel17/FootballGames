<?php

namespace App\Services\GameServices\GameResult;

use App\DTOs\Game\GameResult\GameResultDTO;
use App\DTOs\Game\GameResult\GameResultResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Game\GameEntry;
use App\Models\Game\GameInstance;
use App\Models\Game\GameResult;
use App\Models\User;
use App\Resources\GameStructure\GameResultResource;
use App\Services\Pagination\IPaginationService;

class GameResultService implements IGameResultService
{
    private readonly IPaginationService $_paginationService;

    public function __construct(IPaginationService $paginationService)
    {
        $this->_paginationService = $paginationService;
    }

    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO
    {
        $query = GameResult::query();

        $allowedFilters = ['game_instance_id', 'user_id'];
        $searchableFields = [];

        return $this->_paginationService->paginate($query, $paginationDTO, GameResultResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById(int $id): GameResultResource
    {
        $gameResult = GameResult::findOrFail($id);
        return GameResultResource::make($gameResult);
    }
    public function getByGameInstanceId(User $user, int $gameInstanceId): GameResultResource
    {
        $gameInstance = GameInstance::findOrFail($gameInstanceId);
        $entry = GameEntry::where('game_instance_id', $gameInstance->id)->where('user_id', $user->id)->firstOr();
        $gameResult = GameResult::where('game_entry_id', $entry->id)->firstOr();
        return GameResultResource::make($gameResult);
    }

    public function create(GameResultDTO $dto): GameResultResource
    {
        $gameResult = GameResult::create($dto->toArray());
        return GameResultResource::make($gameResult);
    }

    public function getGameResultsCount(int $gameInstanceId): int
    {
        return GameResult::whereHas('entry', function ($q) use ($gameInstanceId) {
            $q->where('game_instance_id', $gameInstanceId);
        })->count();
    }


    public function update(int $id, GameResultDTO $dto): GameResultResource
    {
        $gameResult = GameResult::findOrFail($id);
        $gameResult->update($dto->toArray());
        return GameResultResource::make($gameResult);
    }

    public function delete(int $id): void
    {
        $gameResult = GameResult::findOrFail($id);
        $gameResult->delete();
    }
}
