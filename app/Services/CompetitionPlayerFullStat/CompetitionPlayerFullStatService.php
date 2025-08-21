<?php

namespace App\Services\CompetitionPlayerFullStat;

use App\DTOs\Core\CompetitionPlayerFullStat\CompetitionPlayerFullStatDTO;
use App\DTOs\Core\CompetitionPlayerFullStat\CompetitionPlayerFullStatResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\CompetitionPlayerFullStat;
use App\Services\Pagination\IPaginationService;

class CompetitionPlayerFullStatService implements ICompetitionPlayerFullStatService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = [
            'competition_id',
            'player_id',
            'appearances',
            'minutes_played',
            'goals',
            'assists',
            'yellow_cards',
            'red_cards',
            'clean_sheets',
            'saves',
            'penalties_saved',
            'own_goals',
            'goals_conceded'
        ];
        $searchableFields = ['player.name'];
        $query = CompetitionPlayerFullStat::with('competition', 'player');

        return $this->_paginationService
            ->paginate($query, $dto, CompetitionPlayerFullStatResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): CompetitionPlayerFullStatResponseDTO
    {
        $stat = CompetitionPlayerFullStat::findOrFail($id);
        return new CompetitionPlayerFullStatResponseDTO($stat);
    }

    public function create(CompetitionPlayerFullStatDTO $data): CompetitionPlayerFullStatResponseDTO
    {
        $stat = CompetitionPlayerFullStat::create($data->toArray());
        return new CompetitionPlayerFullStatResponseDTO($stat);
    }

    public function update($id, CompetitionPlayerFullStatDTO $data): CompetitionPlayerFullStatResponseDTO
    {
        $stat = CompetitionPlayerFullStat::findOrFail($id);
        $stat->update($data->toArray());
        return new CompetitionPlayerFullStatResponseDTO($stat);
    }

    public function delete($id): bool
    {
        $stat = CompetitionPlayerFullStat::findOrFail($id);
        $stat->delete();
        return true;
    }
}
