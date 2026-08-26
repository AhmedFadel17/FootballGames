<?php

namespace App\Services\Core\Players;

use App\DTOs\Core\PlayerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Player;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PlayerService implements IPlayerService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Player::query()->with('country'), $dto)
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
}
