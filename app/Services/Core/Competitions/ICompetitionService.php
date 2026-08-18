<?php

namespace App\Services\Core\Competitions;

use App\DTOs\Core\CompetitionDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Competition;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ICompetitionService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): Competition;
    public function create(CompetitionDTO $data): Competition;
    public function update(int $id, CompetitionDTO $data): Competition;
    public function delete(int $id): bool;
}