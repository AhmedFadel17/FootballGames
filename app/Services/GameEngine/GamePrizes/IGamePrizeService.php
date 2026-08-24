<?php

namespace App\Services\GameEngine\GamePrizes;

use App\DTOs\GameEngine\GamePrizeDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GameEngine\GamePrize;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;


interface IGamePrizeService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): GamePrize;
    public function create(GamePrizeDTO $dto): GamePrize;
    public function update(int $id, GamePrizeDTO $dto): GamePrize;
    public function delete(int $id): void;
}