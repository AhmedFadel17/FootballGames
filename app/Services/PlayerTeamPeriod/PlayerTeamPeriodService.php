<?php

namespace App\Services\PlayerTeamPeriod;

use App\DTOs\Core\PlayerTeamPeriod\PlayerTeamPeriodDTO;
use App\DTOs\Core\PlayerTeamPeriod\PlayerTeamPeriodResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\PlayerTeamPeriod;
use App\Services\Pagination\IPaginationService;

class PlayerTeamPeriodService implements IPlayerTeamPeriodService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['player_id', 'team_id', 'start_date', 'end_date'];
        $searchableFields = [];

        return $this->_paginationService
            ->paginate(PlayerTeamPeriod::query(), $dto, PlayerTeamPeriodResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): PlayerTeamPeriodResponseDTO
    {
        $period = PlayerTeamPeriod::findOrFail($id);
        return new PlayerTeamPeriodResponseDTO($period);
    }

    public function create(PlayerTeamPeriodDTO $data): PlayerTeamPeriodResponseDTO
    {
        $period = PlayerTeamPeriod::create($data->toArray());
        return new PlayerTeamPeriodResponseDTO($period);
    }

    public function update($id, PlayerTeamPeriodDTO $data): PlayerTeamPeriodResponseDTO
    {
        $period = PlayerTeamPeriod::findOrFail($id);
        $period->update($data->toArray());
        return new PlayerTeamPeriodResponseDTO($period);
    }

    public function delete($id): bool
    {
        $period = PlayerTeamPeriod::findOrFail($id);
        $period->delete();
        return true;
    }
} 