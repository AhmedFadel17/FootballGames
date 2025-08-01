<?php

namespace App\Services\Season;

use App\DTOs\Core\Season\SeasonDTO;
use App\DTOs\Core\Season\SeasonResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Season;
use App\Services\Pagination\IPaginationService;

class SeasonService implements ISeasonService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['start_year', 'end_year'];
        $searchableFields = ['name'];

        return $this->_paginationService
            ->paginate(Season::query(), $dto, SeasonResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): SeasonResponseDTO
    {
        $season = Season::findOrFail($id);
        return new SeasonResponseDTO($season);
    }

    public function create(SeasonDTO $data): SeasonResponseDTO
    {
        $season = Season::create($data->toArray());
        return new SeasonResponseDTO($season);
    }

    public function update($id, SeasonDTO $data): SeasonResponseDTO
    {
        $season = Season::findOrFail($id);
        $season->update($data->toArray());
        return new SeasonResponseDTO($season);
    }

    public function delete($id): bool
    {
        $season = Season::findOrFail($id);
        $season->delete();
        return true;
    }
} 