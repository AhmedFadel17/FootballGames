<?php

namespace App\Services\Core\Players;

use App\DTOs\Core\PlayerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Manager;
use App\Models\Core\Player;
use App\Models\Core\PlayerTeamPeriod;
use App\Models\Core\Team;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PlayerService implements IPlayerService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Player::query()->with(['country', 'currentTeam']), $dto)
            ->allowFilters(['country_id', 'popularity', 'date_of_birth', 'position', 'name', 'fullname', 'height_cm', 'weight_kg', 'market_value', 'preferred_foot', 'rating'])
            ->allowSorts(['id', 'name', 'country_id', 'popularity', 'date_of_birth', 'position', 'name', 'fullname', 'height_cm', 'weight_kg', 'market_value', 'preferred_foot', 'rating'])
            ->searchable(['name', 'fullname'])
            ->paginate();
    }

    public function getOptions(string $query, int $limit = 10): Collection
    {
        $term = trim($query);

        if (strlen($term) < 2) {
            return collect();
        }

        return Player::query()
            ->select(['id', 'name', 'img_src', 'popularity'])
            ->where('name', 'ILIKE', "%{$term}%")
            ->orderBy('popularity', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): Player
    {
        $player = Player::with([
            'country',
            'teamPeriods.team',
            'transfers.fromTeam',
            'transfers.toTeam',
            'careerSeasonStats.competition',
            'careerSeasonStats.season',
            'careerSeasonStats.team',
            'careerSummaries.team',
        ])->findOrFail($id);
        return $player;
    }

    public function create(PlayerDTO $data): Player
    {
        $player = Player::create($data->toArray());
        $player->load('country');
        return $player;
    }

    public function update($id, PlayerDTO $data): Player
    {
        $player = Player::findOrFail($id);
        $player->update($data->toUpdateArray());
        $player->load('country');
        return $player;
    }

    public function delete($id): bool
    {
        $player = Player::findOrFail($id);
        $player->delete();
        return true;
    }

    public function getRandom(int $minPopularity, bool $includeRetired = false, int $limit): Collection
    {
        $query = Player::query()
            ->where('popularity', '>=', $minPopularity);

        if (!$includeRetired) {
            $query->where('is_retired', false);
        }

        return $query->inRandomOrder()->limit($limit)->get();
    }

    public function playedTogether(Player $player1, Player $player2): bool
    {
        if ($player1->id === $player2->id) {
            return false;
        }

        if (
            $player1->current_team_id !== null &&
            $player1->current_team_id === $player2->current_team_id
        ) {
            return true;
        }

        return DB::table('player_team_periods as pt1')
            ->join('player_team_periods as pt2', function ($join) use ($player1, $player2) {
                $join->on('pt1.team_id', '=', 'pt2.team_id')
                    ->where('pt1.player_id', '=', $player1->id)
                    ->where('pt2.player_id', '=', $player2->id)
                    ->whereRaw("pt1.start_date <= COALESCE(pt2.end_date, '9999-12-31')")
                    ->whereRaw("pt2.start_date <= COALESCE(pt1.end_date, '9999-12-31')");
            })
            ->exists();
    }

    public function playedForTeam(Player $player, Team $team): bool
    {
        if ($player->current_team_id !== null && $player->current_team_id === $team->id) {
            return true;
        }

        return PlayerTeamPeriod::query()
            ->where('player_id', $player->id)
            ->where('team_id', $team->id)
            ->exists();
    }

    public function playedUnderManager(Player $player, Manager $manager): bool
    {
        if (
            $player->current_team_id !== null &&
            $player->current_team_id === $manager->current_team_id
        ) {
            return true;
        }

        return DB::table('player_team_periods as pt')
            ->join('manager_team_periods as mt', function ($join) use ($player, $manager) {
                $join->on('pt.team_id', '=', 'mt.team_id')
                    ->where('pt.player_id', '=', $player->id)
                    ->where('mt.manager_id', '=', $manager->id)
                    ->whereRaw("pt.start_date <= COALESCE(mt.end_date, '9999-12-31')")
                    ->whereRaw("mt.start_date <= COALESCE(pt.end_date, '9999-12-31')");
            })
            ->exists();
    }
}
