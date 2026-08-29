<?php

namespace App\Services\Core\Continents;

use App\DTOs\Core\ContinentDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Continent;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IContinentService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): Continent;
    public function create(ContinentDTO $data): Continent;
    public function update(int $id, ContinentDTO $data): Continent;
    public function delete(int $id): bool;

    public function getRandom(int $minPopularity, int $limit): Collection;
}