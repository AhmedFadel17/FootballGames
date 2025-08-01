<?php

namespace App\Services\Team;

use App\DTOs\Core\Team\TeamDTO;
use App\DTOs\Core\Team\TeamResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface ITeamService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :TeamResponseDTO;
    public function create(TeamDTO $data) : TeamResponseDTO;
    public function update(int $id, TeamDTO $data) :TeamResponseDTO;
    public function delete(int $id):bool;
} 