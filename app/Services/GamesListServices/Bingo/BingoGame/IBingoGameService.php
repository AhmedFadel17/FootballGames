<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;

use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface IBingoGameService
{
    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO;
    public function getById(int $id): BingoGameResponseDTO;
    public function create(BingoGameDTO $dto): BingoGameResponseDTO;
    public function update(int $id, BingoGameDTO $dto): BingoGameResponseDTO;
    public function delete(int $id): void;
} 