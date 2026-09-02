<?php

namespace App\Services\GamesListServices\Career\CareerGame;

use App\DTOs\GamesList\Career\CareerGameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Models\GamesList\Career\CareerGame;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;


interface ICareerGameService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): CareerGame;
    public function getRandom(User $user, GameDifficulty $difficulty): ?CareerGame;
    public function create(CareerGameDTO $dto): CareerGame;
    public function update(int $id, CareerGameDTO $data): CareerGame;
    public function delete(int $id): bool;
}
