<?php

namespace App\Services\Core\Teams;

use App\DTOs\Core\TeamDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Team;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class TeamService implements ITeamService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Team::query()->with('country'), $dto)
            ->allowFilters(['country_id', 'popularity', 'name', 'abbr', 'api_id'])
            ->allowSorts(['id', 'name', 'country_id', 'popularity', 'name', 'abbr', 'api_id'])
            ->searchable(['name', 'abbr'])
            ->paginate();
    }

    public function getOptions(string $query, int $limit = 10): Collection
    {
        $term = trim($query);

        if (strlen($term) < 2) {
            return collect();
        }

        return Team::query()
            ->select(['id', 'name', 'img_src', 'popularity'])
            ->where('name', 'ILIKE', "%{$term}%")
            ->orderBy('popularity', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): Team
    {
        $team = Team::with('country')->findOrFail($id);
        return $team;
    }

    public function create(TeamDTO $data): Team
    {
        $team = Team::create($data->toArray());
        $team->load('country');
        return $team;
    }

    public function update($id, TeamDTO $data): Team
    {
        $team = Team::findOrFail($id);
        $team->update($data->toUpdateArray());
        $team->load('country');
        return $team;
    }

    public function delete($id): bool
    {
        $team = Team::findOrFail($id);
        $team->delete();
        return true;
    }
}