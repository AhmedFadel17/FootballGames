<?php

namespace App\Services\GameServices\GamePrize;

use App\DTOs\Game\GamePrize\GamePrizeDTO;
use App\DTOs\Game\GamePrize\GamePrizeResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Game\GamePrize;
use App\Services\Pagination\IPaginationService;

class GamePrizeService implements IGamePrizeService
{
    private readonly IPaginationService $_paginationService;

    public function __construct(IPaginationService $paginationService)
    {
        $this->_paginationService = $paginationService;
    }

    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO
    {
        $query = GamePrize::query();

        $allowedFilters = ['game_instance_id', 'rank'];
        $searchableFields = [];

        return $this->_paginationService->paginate($query, $paginationDTO,GamePrizeResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById(int $id): GamePrizeResponseDTO
    {
        $gamePrize = GamePrize::findOrFail($id);
        return GamePrizeResponseDTO::fromModel($gamePrize);
    }

    public function create(GamePrizeDTO $dto): GamePrizeResponseDTO
    {
        $gamePrize = GamePrize::create($dto->toArray());
        return GamePrizeResponseDTO::fromModel($gamePrize);
    }

    public function update(int $id, GamePrizeDTO $dto): GamePrizeResponseDTO
    {
        $gamePrize = GamePrize::findOrFail($id);
        $gamePrize->update($dto->toArray());
        return GamePrizeResponseDTO::fromModel($gamePrize);
    }

    public function delete(int $id): void
    {
        $gamePrize = GamePrize::findOrFail($id);
        $gamePrize->delete();
    }
} 