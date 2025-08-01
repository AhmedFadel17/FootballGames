<?php

namespace App\Services\ManagerTeamPeriod;

use App\DTOs\Core\ManagerTeamPeriod\ManagerTeamPeriodDTO;
use App\DTOs\Core\ManagerTeamPeriod\ManagerTeamPeriodResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\ManagerTeamPeriod;
use App\Services\Pagination\IPaginationService;

class ManagerTeamPeriodService implements IManagerTeamPeriodService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['manager_id', 'team_id', 'start_date', 'end_date'];
        $searchableFields = [];

        return $this->_paginationService
            ->paginate(ManagerTeamPeriod::query(), $dto, ManagerTeamPeriodResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): ManagerTeamPeriodResponseDTO
    {
        $period = ManagerTeamPeriod::findOrFail($id);
        return new ManagerTeamPeriodResponseDTO($period);
    }

    public function create(ManagerTeamPeriodDTO $data): ManagerTeamPeriodResponseDTO
    {
        $period = ManagerTeamPeriod::create($data->toArray());
        return new ManagerTeamPeriodResponseDTO($period);
    }

    public function update($id, ManagerTeamPeriodDTO $data): ManagerTeamPeriodResponseDTO
    {
        $period = ManagerTeamPeriod::findOrFail($id);
        $period->update($data->toArray());
        return new ManagerTeamPeriodResponseDTO($period);
    }

    public function delete($id): bool
    {
        $period = ManagerTeamPeriod::findOrFail($id);
        $period->delete();
        return true;
    }
} 