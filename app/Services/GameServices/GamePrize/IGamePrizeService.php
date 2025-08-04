<?php

namespace App\Services\GameServices\GamePrize;

use App\DTOs\Game\GamePrize\GamePrizeDTO;
use App\DTOs\Game\GamePrize\GamePrizeResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface IGamePrizeService
{
    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO;
    public function getById(int $id): GamePrizeResponseDTO;
    public function create(GamePrizeDTO $dto): GamePrizeResponseDTO;
    public function update(int $id, GamePrizeDTO $dto): GamePrizeResponseDTO;
    public function delete(int $id): void;
} 