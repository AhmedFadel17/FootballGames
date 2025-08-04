<?php

namespace App\Services\GameServices\GameInstance;

use App\DTOs\Game\GameInstance\GameInstanceDTO;
use App\DTOs\Game\GameInstance\GameInstanceResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Game\GameInstance;
use App\Services\Pagination\IPaginationService;

class GameInstanceService implements IGameInstanceService
{
    private readonly IPaginationService $_paginationService;

    public function __construct(IPaginationService $paginationService)
    {
        $this->_paginationService = $paginationService;
    }

    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO
    {
        $query = GameInstance::query();

        $allowedFilters = ['game_id', 'status'];
        $searchableFields = [];

        return $this->_paginationService->paginate($query, $paginationDTO,GameInstanceResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById(int $id): GameInstanceResponseDTO
    {
        $gameInstance = GameInstance::findOrFail($id);
        return GameInstanceResponseDTO::fromModel($gameInstance);
    }

    public function create(GameInstanceDTO $dto): GameInstanceResponseDTO
    {
        $gameInstance = GameInstance::create($dto->toArray());
        return GameInstanceResponseDTO::fromModel($gameInstance);
    }

    public function update(int $id, GameInstanceDTO $dto): GameInstanceResponseDTO
    {
        $gameInstance = GameInstance::findOrFail($id);
        $gameInstance->update($dto->toArray());
        return GameInstanceResponseDTO::fromModel($gameInstance);
    }

    public function delete(int $id): void
    {
        $gameInstance = GameInstance::findOrFail($id);
        $gameInstance->delete();
    }
} 