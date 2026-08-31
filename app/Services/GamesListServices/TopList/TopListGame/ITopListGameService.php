<?php

namespace App\Services\GamesListServices\TopList\TopListGame;


use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\GamesList\TopList\TopListGameInstanceDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListGameInstance;
use App\Models\GamesList\TopList\TopListGuess;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ITopListGameService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): TopListGame;
    public function getRandom(User $user, GameDifficulty $difficulty): ?TopListGame;
    public function create(TopListGameDTO $dto): TopListGame;
    public function update(int $id, TopListGameDTO $data): TopListGame;
    public function delete(int $id): bool;
}
