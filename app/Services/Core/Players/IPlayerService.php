<?php

namespace App\Services\Core\Players;

use App\DTOs\Core\PlayerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Player;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IPlayerService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getOptions(string $query, int $limit = 10): Collection;
    public function getById(int $id): Player;
    public function create(PlayerDTO $data): Player;
    public function update(int $id, PlayerDTO $data): Player;
    public function delete(int $id): bool;
}
