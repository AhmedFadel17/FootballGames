<?php

namespace App\Services\GameEngine\GameEntries;

use App\DTOs\GameEngine\GameEntryDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GameEngine\GameEntry;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IGameEntryService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): GameEntry;
    public function getByUserAndGameInstance(int $userId, int $gameInstanceId): ?GameEntry;
    public function create(GameEntryDTO $dto): GameEntry;
    public function update(int $id, GameEntryDTO $dto): GameEntry;
    public function delete(int $id): void;
}