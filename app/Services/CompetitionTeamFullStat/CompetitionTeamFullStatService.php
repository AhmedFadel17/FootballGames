<?php

namespace App\Services\CompetitionTeamFullStat;

use App\DTOs\Core\CompetitionTeamFullStat\CompetitionTeamFullStatDTO;
use App\DTOs\Core\CompetitionTeamFullStat\CompetitionTeamFullStatResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\CompetitionTeamFullStat;
use App\Services\Pagination\IPaginationService;

class CompetitionTeamFullStatService implements ICompetitionTeamFullStatService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['competition_id', 'team_id'];
        $searchableFields = [];

        return $this->_paginationService
            ->paginate(CompetitionTeamFullStat::query(), $dto, CompetitionTeamFullStatResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): CompetitionTeamFullStatResponseDTO
    {
        $stat = CompetitionTeamFullStat::findOrFail($id);
        return new CompetitionTeamFullStatResponseDTO($stat);
    }

    public function create(CompetitionTeamFullStatDTO $data): CompetitionTeamFullStatResponseDTO
    {
        $stat = CompetitionTeamFullStat::create($data->toArray());
        return new CompetitionTeamFullStatResponseDTO($stat);
    }

    public function update($id, CompetitionTeamFullStatDTO $data): CompetitionTeamFullStatResponseDTO
    {
        $stat = CompetitionTeamFullStat::findOrFail($id);
        $stat->update($data->toArray());
        return new CompetitionTeamFullStatResponseDTO($stat);
    }

    public function delete($id): bool
    {
        $stat = CompetitionTeamFullStat::findOrFail($id);
        $stat->delete();
        return true;
    }
} 