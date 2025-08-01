<?php

namespace App\Services\PlayerTeamPeriod;

use App\DTOs\Core\PlayerTeamPeriod\PlayerTeamPeriodDTO;
use App\DTOs\Core\PlayerTeamPeriod\PlayerTeamPeriodResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface IPlayerTeamPeriodService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :PlayerTeamPeriodResponseDTO;
    public function create(PlayerTeamPeriodDTO $data) : PlayerTeamPeriodResponseDTO;
    public function update(int $id, PlayerTeamPeriodDTO $data) :PlayerTeamPeriodResponseDTO;
    public function delete(int $id):bool;
} 