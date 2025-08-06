<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;

use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionResponseDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\User;

interface IBingoGameService
{
    public function skip(int $gameId): void;
    public function check(int $gameId, int $conditionId): BingoConditionResponseDTO;

    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO;
    public function getById(int $id): BingoGameResponseDTO;
    public function create(int $game_id,int $size,User $user): BingoGameResponseDTO;
    public function update(int $id, BingoGameDTO $dto): BingoGameResponseDTO;
    public function delete(int $id): void;
} 