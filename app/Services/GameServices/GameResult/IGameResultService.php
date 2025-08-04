<?php

namespace App\Services\GameServices\GameResult;

use App\DTOs\Game\GameResult\GameResultDTO;
use App\DTOs\Game\GameResult\GameResultResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface IGameResultService
{
    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO;
    public function getById(int $id): GameResultResponseDTO;
    public function create(GameResultDTO $dto): GameResultResponseDTO;
    public function update(int $id, GameResultDTO $dto): GameResultResponseDTO;
    public function delete(int $id): void;
} 