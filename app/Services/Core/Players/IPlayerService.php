<?php

namespace App\Services\Core\Players;

use App\DTOs\Core\PlayerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Player;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IPlayerService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): Player;
    public function create(PlayerDTO $data): Player;
    public function update(int $id, PlayerDTO $data): Player;
    public function delete(int $id): bool;
}
