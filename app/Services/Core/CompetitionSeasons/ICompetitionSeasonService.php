<?php

namespace App\Services\Core\CompetitionSeasons;

use App\DTOs\Core\CompetitionSeasonDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\CompetitionSeason;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ICompetitionSeasonService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): CompetitionSeason;
    public function getStandingsBySeasonId(int $id);
    public function create(CompetitionSeasonDTO $data): CompetitionSeason;
    public function update(int $id, CompetitionSeasonDTO $data): CompetitionSeason;
    public function delete(int $id): bool;
}