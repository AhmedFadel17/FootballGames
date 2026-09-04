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
            ->for(Team::query()->with('country', 'currentCompetition'), $dto)
            ->allowFilters(['country_id', 'popularity', 'name', 'abbr', 'api_id', 'current_competition_id', 'slug'])
            ->allowSorts(['id', 'name', 'country_id', 'popularity', 'abbr', 'api_id', 'current_competition_id', 'slug'])
            ->searchable(['name', 'abbr', 'slug'])
            ->paginate();
    }

    public function getOptions(?string $query = null, ?int $limit = 10): Collection
    {

        $term = trim($query);

        $searchable = strlen($term) >= 2;

        return Team::query()
            ->select(['id', 'name', 'img_src', 'popularity'])
            ->when($searchable, function ($query) use ($term) {
                $query->where('name', 'ILIKE', "%{$term}%");
            })
            ->orderBy('popularity', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): Team
    {
        $team = Team::with([
            'country',
            'currentCompetition',
            'currentSquad.country',
            'currentManager.country',
            'wonCompetitionSeasons.competition',
            'wonCompetitionSeasons.season',
            'standings.competitionSeason.competition',
            'standings.competitionSeason.season',
            'managerPeriods.manager.country',
        ])->findOrFail($id);

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

    public function getRandom(int $minPopularity, int $limit): Collection
    {
        return Team::query()
            ->where('popularity', '>=', $minPopularity)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }
}