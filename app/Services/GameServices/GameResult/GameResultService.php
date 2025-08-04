<?php

namespace App\Services\GameServices\GameResult;

use App\DTOs\Game\GameResult\GameResultDTO;
use App\DTOs\Game\GameResult\GameResultResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Game\GameResult;
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

        return $this->_paginationService->paginate($query, $paginationDTO,GameResultResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById(int $id): GameResultResponseDTO
    {
        $gameResult = GameResult::findOrFail($id);
        return GameResultResponseDTO::fromModel($gameResult);
    }

    public function create(GameResultDTO $dto): GameResultResponseDTO
    {
        $gameResult = GameResult::create($dto->toArray());
        return GameResultResponseDTO::fromModel($gameResult);
    }

    public function update(int $id, GameResultDTO $dto): GameResultResponseDTO
    {
        $gameResult = GameResult::findOrFail($id);
        $gameResult->update($dto->toArray());
        return GameResultResponseDTO::fromModel($gameResult);
    }

    public function delete(int $id): void
    {
        $gameResult = GameResult::findOrFail($id);
        $gameResult->delete();
    }
} 