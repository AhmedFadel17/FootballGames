<?php

namespace App\Services\Competition;

use App\DTOs\Core\Competition\CompetitionDTO;
use App\DTOs\Core\Competition\CompetitionResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Competition;
use App\Services\Pagination\IPaginationService;

class CompetitionService implements ICompetitionService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['country_id', 'type', 'tier', 'is_active'];
        $searchableFields = ['name', 'short_name'];

        return $this->_paginationService
            ->paginate(Competition::query(), $dto, CompetitionResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): CompetitionResponseDTO
    {
        $competition = Competition::findOrFail($id);
        return new CompetitionResponseDTO($competition);
    }

    public function create(CompetitionDTO $data): CompetitionResponseDTO
    {
        $competition = Competition::create($data->toArray());
        return new CompetitionResponseDTO($competition);
    }

    public function update($id, CompetitionDTO $data): CompetitionResponseDTO
    {
        $competition = Competition::findOrFail($id);
        $competition->update($data->toArray());
        return new CompetitionResponseDTO($competition);
    }

    public function delete($id): bool
    {
        $competition = Competition::findOrFail($id);
        $competition->delete();
        return true;
    }
} 