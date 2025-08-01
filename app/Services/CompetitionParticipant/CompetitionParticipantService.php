<?php

namespace App\Services\CompetitionParticipant;

use App\DTOs\Core\CompetitionParticipant\CompetitionParticipantDTO;
use App\DTOs\Core\CompetitionParticipant\CompetitionParticipantResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\CompetitionParticipant;
use App\Services\Pagination\IPaginationService;

class CompetitionParticipantService implements ICompetitionParticipantService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['competition_id', 'season_id', 'team_id', 'is_winner'];
        $searchableFields = [];

        return $this->_paginationService
            ->paginate(CompetitionParticipant::query(), $dto, CompetitionParticipantResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): CompetitionParticipantResponseDTO
    {
        $participant = CompetitionParticipant::findOrFail($id);
        return new CompetitionParticipantResponseDTO($participant);
    }

    public function create(CompetitionParticipantDTO $data): CompetitionParticipantResponseDTO
    {
        $participant = CompetitionParticipant::create($data->toArray());
        return new CompetitionParticipantResponseDTO($participant);
    }

    public function update($id, CompetitionParticipantDTO $data): CompetitionParticipantResponseDTO
    {
        $participant = CompetitionParticipant::findOrFail($id);
        $participant->update($data->toArray());
        return new CompetitionParticipantResponseDTO($participant);
    }

    public function delete($id): bool
    {
        $participant = CompetitionParticipant::findOrFail($id);
        $participant->delete();
        return true;
    }
} 