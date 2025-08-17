<?php

namespace App\Services\GameServices\GameType;

use App\DTOs\Game\GameType\GameTypeDTO;
use App\DTOs\Game\GameType\GameTypeResponseDTO;

interface IGameTypeService
{
    public function getAll(): array;
    public function getAllWithGamesList(): array;
    public function getById(int $id): GameTypeResponseDTO;
    public function create(GameTypeDTO $dto): GameTypeResponseDTO;
    public function update(int $id, GameTypeDTO $dto): GameTypeResponseDTO;
    public function delete(int $id): void;
} 