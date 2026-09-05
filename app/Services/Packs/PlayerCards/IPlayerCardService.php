<?php

namespace App\Services\Packs\PlayerCards;

use App\DTOs\Packs\PlayerCardDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\PlayerCard;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IPlayerCardService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;

    public function getOptions(?string $query = null, ?int $limit = 10): Collection;

    public function getById($id): PlayerCard;

    public function create(PlayerCardDTO $data): PlayerCard;

    public function update($id, PlayerCardDTO $data): PlayerCard;

    public function delete($id): bool;
}