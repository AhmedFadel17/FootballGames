<?php

namespace App\Services\Core\CompetitionSeasons;

use App\DTOs\Core\CompetitionSeasonDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\CompetitionSeason;
use App\Models\Core\Standing;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CompetitionSeasonService implements ICompetitionSeasonService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        $query = CompetitionSeason::query()
            ->select('competition_seasons.*')
            ->leftJoin('seasons as season', 'competition_seasons.season_id', '=', 'season.id')
            ->with(['competition', 'season', 'winnerTeam']);

        return $this->_paginationService
            ->for($query, $dto)
            ->allowFilters(['competition_id', 'season_id', 'winner_team_id'])
            ->allowSorts(['id', 'competition_id', 'season_id', 'winner_team_id', 'season.start_year'])
            ->searchable(['competition.name', 'season.name', 'winnerTeam.name'])
            ->paginate();
    }

    public function getById($id): CompetitionSeason
    {
        $competition = CompetitionSeason::with(['competition', 'season', 'winnerTeam'])->findOrFail($id);
        return $competition;
    }

    public function getStandingsBySeasonId(int $id)
    {
        return Standing::query()
            ->where('competition_season_id', $id)
            ->with('team')
            ->orderBy('position')
            ->get();
    }

    public function create(CompetitionSeasonDTO $data): CompetitionSeason
    {
        $competition = CompetitionSeason::create($data->toArray());
        $competition->load(['competition', 'season', 'winnerTeam']);
        return $competition;
    }

    public function update($id, CompetitionSeasonDTO $data): CompetitionSeason
    {
        $competition = CompetitionSeason::findOrFail($id);
        $competition->update($data->toUpdateArray());
        $competition->load(['competition', 'season', 'winnerTeam']);
        return $competition;
    }

    public function delete($id): bool
    {
        $competition = CompetitionSeason::findOrFail($id);
        $competition->delete();
        return true;
    }
}