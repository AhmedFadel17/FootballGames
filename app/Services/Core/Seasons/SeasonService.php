<?php

namespace App\Services\Core\Seasons;

use App\DTOs\Core\SeasonDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Season;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SeasonService implements ISeasonService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Season::query(), $dto)
            ->allowFilters(['id', 'name', 'start_year', 'end_year'])
            ->allowSorts(['id', 'name', 'start_year', 'end_year'])
            ->searchable(['name'])
            ->paginate();
    }

    public function getById($id): Season
    {
        $season = Season::findOrFail($id);
        return $season;
    }

    public function create(SeasonDTO $data): Season
    {
        $season = Season::create($data->toArray());
        return $season;
    }

    public function update($id, SeasonDTO $data): Season
    {
        $season = Season::findOrFail($id);
        $season->update($data->toUpdateArray());
        return $season;
    }

    public function delete($id): bool
    {
        $season = Season::findOrFail($id);
        $season->delete();
        return true;
    }
}