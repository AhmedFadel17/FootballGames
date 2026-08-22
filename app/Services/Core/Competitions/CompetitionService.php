<?php

namespace App\Services\Core\Competitions;

use App\DTOs\Core\CompetitionDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Competition;
use App\Models\Core\Team;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CompetitionService implements ICompetitionService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Competition::query()->with('country'), $dto)
            ->allowFilters(['country_id', 'type', 'tier', 'is_active'])
            ->allowSorts(['id', 'name', 'abbr', 'country_id', 'popularity', 'api_id', 'type', 'tier', 'is_active'])
            ->searchable(['name', 'abbr'])
            ->paginate();
    }

    public function getById($id): Competition
    {
        $competition = Competition::with('country')->findOrFail($id);
        return $competition;
    }

    public function getTeamsByCompetitionId(int $id, PaginationDTO $dto): LengthAwarePaginator
    {
        $query = Team::query()
            ->whereIn('id', function ($subQuery) use ($id) {
                $subQuery->select('team_id')
                    ->from('standings')
                    ->whereIn('competition_season_id', function ($seasonQuery) use ($id) {
                        $seasonQuery->select('id')
                            ->from('competition_seasons')
                            ->where('competition_id', $id);
                    });
            })
            ->select('teams.*')
            ->selectSub(function ($subQuery) use ($id) {
                $subQuery->selectRaw('COUNT(DISTINCT cs.id)')
                    ->from('competition_seasons as cs')
                    ->leftJoin('standings as st', 'cs.id', '=', 'st.competition_season_id')
                    ->where('cs.competition_id', $id)
                    ->where(function ($w) {
                        $w->whereColumn('cs.winner_team_id', 'teams.id')
                            ->orWhere(function ($q) {
                                $q->whereColumn('st.team_id', 'teams.id')
                                    ->where('st.position', 1);
                            });
                    });
            }, 'titles_won')
            ->with('country');

        return $this->_paginationService
            ->for($query, $dto)
            ->allowFilters(['country_id', 'popularity'])
            ->allowSorts(['id', 'name', 'abbr', 'popularity', 'titles_won'])
            ->searchable(['name', 'abbr'])
            ->paginate();
    }

    public function create(CompetitionDTO $data): Competition
    {
        $competition = Competition::create($data->toArray());
        $competition->load('country');
        return $competition;
    }

    public function update($id, CompetitionDTO $data): Competition
    {
        $competition = Competition::findOrFail($id);
        $competition->update($data->toUpdateArray());
        $competition->load('country');
        return $competition;
    }

    public function delete($id): bool
    {
        $competition = Competition::findOrFail($id);
        $competition->delete();
        return true;
    }
}