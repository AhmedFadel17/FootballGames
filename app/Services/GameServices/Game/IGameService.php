<?php

namespace App\Services\GameServices\Game;

use App\DTOs\Game\Game\GameDTO;
use App\DTOs\Game\Game\GameResponseDTO;
use App\DTOs\Pagination\PaginationDTO;

interface IGameService
{
    public function getAll(array $dto): array;
    public function getById(int $id): GameResponseDTO;
    public function create(GameDTO $dto): GameResponseDTO;
    public function update(int $id, GameDTO $dto): GameResponseDTO;
    public function delete(int $id): void;
} 