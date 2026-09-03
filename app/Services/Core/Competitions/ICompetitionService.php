<?php

namespace App\Services\Core\Competitions;

use App\DTOs\Core\CompetitionDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Competition;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ICompetitionService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getOptions(?string $query = null, ?int $limit = 10): Collection;
    public function getById(int $id): Competition;
    public function getTeamsByCompetitionId(int $id, PaginationDTO $dto): LengthAwarePaginator;
    public function create(CompetitionDTO $data): Competition;
    public function update(int $id, CompetitionDTO $data): Competition;
    public function delete(int $id): bool;
}