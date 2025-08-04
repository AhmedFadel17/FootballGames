<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;

use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\GamesList\Bingo\BingoGame;
use App\Services\Pagination\IPaginationService;

class BingoGameService implements IBingoGameService
{
    private readonly IPaginationService $_paginationService;

    public function __construct(IPaginationService $paginationService)
    {
        $this->_paginationService = $paginationService;
    }

    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO
    {
        $query = BingoGame::query();

        $allowedFilters = ['game_instance_id'];
        $searchableFields = [];

        return $this->_paginationService->paginate($query, $paginationDTO,BingoGameResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById(int $id): BingoGameResponseDTO
    {
        $bingoGame = BingoGame::findOrFail($id);
        return BingoGameResponseDTO::fromModel($bingoGame);
    }

    public function create(BingoGameDTO $dto): BingoGameResponseDTO
    {
        $bingoGame = BingoGame::create($dto->toArray());
        return BingoGameResponseDTO::fromModel($bingoGame);
    }

    public function update(int $id, BingoGameDTO $dto): BingoGameResponseDTO
    {
        $bingoGame = BingoGame::findOrFail($id);
        $bingoGame->update($dto->toArray());
        return BingoGameResponseDTO::fromModel($bingoGame);
    }

    public function delete(int $id): void
    {
        $bingoGame = BingoGame::findOrFail($id);
        $bingoGame->delete();
    }
} 