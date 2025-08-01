<?php

namespace App\Services\ManagerTeamPeriod;

use App\DTOs\Core\ManagerTeamPeriod\ManagerTeamPeriodDTO;
use App\DTOs\Core\ManagerTeamPeriod\ManagerTeamPeriodResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface IManagerTeamPeriodService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :ManagerTeamPeriodResponseDTO;
    public function create(ManagerTeamPeriodDTO $data) : ManagerTeamPeriodResponseDTO;
    public function update(int $id, ManagerTeamPeriodDTO $data) :ManagerTeamPeriodResponseDTO;
    public function delete(int $id):bool;
} 