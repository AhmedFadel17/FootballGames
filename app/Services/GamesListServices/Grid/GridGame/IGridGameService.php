<?php

namespace App\Services\GamesListServices\Grid\GridGame;

use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\GamesList\Grid\GridGameDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Models\GamesList\Grid\GridGame;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IGridGameService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): GridGame;
    public function getRandom(User $user, GameDifficulty $difficulty, int $size): ?GridGame;
    public function create(GridGameDTO $dto): GridGame;
    public function update(int $id, GridGameDTO $data): GridGame;
    public function delete(int $id): bool;

}