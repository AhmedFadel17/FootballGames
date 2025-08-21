<?php

namespace App\Services\Team;

use App\DTOs\Core\Team\TeamDTO;
use App\DTOs\Core\Team\TeamResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Team;
use App\Services\Pagination\IPaginationService;

class TeamService implements ITeamService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['country_id', 'api_id','name', 'short_name', 'abbr','popularity'];
        $searchableFields = ['name', 'short_name', 'abbr'];

        $query = Team::with('country');

        return $this->_paginationService
            ->paginate($query, $dto, TeamResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): TeamResponseDTO
    {
        $team = Team::with('country')->findOrFail($id);
        return new TeamResponseDTO($team);
    }

    public function create(TeamDTO $data): TeamResponseDTO
    {
        $team = Team::create($data->toArray());
        $team->load('country');
        return new TeamResponseDTO($team);
    }

    public function update($id, TeamDTO $data): TeamResponseDTO
    {
        $team = Team::findOrFail($id);
        $team->update($data->toArray());
        $team->load('country');
        return new TeamResponseDTO($team);
    }

    public function delete($id): bool
    {
        $team = Team::findOrFail($id);
        $team->delete();
        return true;
    }
} 