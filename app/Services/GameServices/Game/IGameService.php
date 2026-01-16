<?php

namespace App\Services\GameServices\Game;

use App\DTOs\Game\Game\GameDTO;
use App\Resources\GameStructure\GameResource;

interface IGameService
{
    public function getAll(array $dto): array;
    public function getById(int $id): GameResource;
    public function create(GameDTO $dto): GameResource;
    public function update(int $id, GameDTO $dto): GameResource;
    public function delete(int $id): void;
} 