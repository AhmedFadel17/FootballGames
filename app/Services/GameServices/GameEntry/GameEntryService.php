<?php

namespace App\Services\GameServices\GameEntry;

use App\DTOs\Game\GameEntry\GameEntryDTO;
use App\DTOs\Game\GameEntry\GameEntryResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Game\GameEntry;
use App\Services\Pagination\IPaginationService;

class GameEntryService implements IGameEntryService
{
        public function __construct(private IPaginationService $_paginationService) {}


    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO
    {
        $query = GameEntry::query();

        $allowedFilters = ['user_id', 'game_instance_id'];
        $searchableFields = [];

        return $this->_paginationService->paginate($query, $paginationDTO,GameEntryResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById(int $id): GameEntryResponseDTO
    {
        $gameEntry = GameEntry::findOrFail($id);
        return GameEntryResponseDTO::fromModel($gameEntry);
    }

    public function create(GameEntryDTO $dto): GameEntryResponseDTO
    {
        $gameEntry = GameEntry::create($dto->toArray());
        return GameEntryResponseDTO::fromModel($gameEntry);
    }

    public function update(int $id, GameEntryDTO $dto): GameEntryResponseDTO
    {
        $gameEntry = GameEntry::findOrFail($id);
        $gameEntry->update($dto->toArray());
        return GameEntryResponseDTO::fromModel($gameEntry);
    }

    public function delete(int $id): void
    {
        $gameEntry = GameEntry::findOrFail($id);
        $gameEntry->delete();
    }
} 