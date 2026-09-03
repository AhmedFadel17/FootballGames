<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;


use App\DTOs\GamesList\Bingo\BingoGameDTO;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\User;
use App\DTOs\Pagination\PaginationDTO;
use App\Enums\GameEngine\GameDifficulty;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IBingoGameService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): BingoGame;
    public function getRandom(User $user, GameDifficulty $difficulty, int $size = 3): ?BingoGame;
    public function create(BingoGameDTO $dto): BingoGame;
    public function update(int $id, BingoGameDTO $data): BingoGame;
    public function delete(int $id): bool;
}
