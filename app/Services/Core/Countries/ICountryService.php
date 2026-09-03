<?php

namespace App\Services\Core\Countries;

use App\DTOs\Core\CountryDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Country;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ICountryService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getOptions(?string $query = null, ?int $limit = 10): Collection;
    public function getById(int $id): Country;
    public function create(CountryDTO $data): Country;
    public function update(int $id, CountryDTO $data): Country;
    public function delete(int $id): bool;
    public function getRandom(int $minPopularity, int $limit): Collection;
}