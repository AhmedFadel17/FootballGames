<?php

namespace App\Services\GameEngine\Games;

use App\DTOs\GameEngine\GameDTO;
use App\Models\GameEngine\Game;
use App\DTOs\Pagination\PaginationDTO;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IGameService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): Game;
    public function create(GameDTO $dto): Game;
    public function update(int $id, GameDTO $dto): Game;
    public function delete(int $id): void;
}