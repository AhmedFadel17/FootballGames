<?php

namespace App\Services\Core\Seasons;

use App\DTOs\Core\SeasonDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Season;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ISeasonService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): Season;
    public function create(SeasonDTO $data): Season;
    public function update(int $id, SeasonDTO $data): Season;
    public function delete(int $id): bool;
}