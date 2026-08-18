<?php

namespace App\Services\Core\Teams;

use App\DTOs\Core\TeamDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Team;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ITeamService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): Team;
    public function create(TeamDTO $data): Team;
    public function update(int $id, TeamDTO $data): Team;
    public function delete(int $id): bool;
}