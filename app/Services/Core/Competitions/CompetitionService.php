<?php

namespace App\Services\Core\Competitions;

use App\DTOs\Core\CompetitionDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Competition;
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
            ->allowSorts(['id', 'name', 'abbr', 'country_id', 'type', 'tier', 'is_active'])
            ->searchable(['name', 'abbr'])
            ->paginate();
    }

    public function getById($id): Competition
    {
        $competition = Competition::with('country')->findOrFail($id);
        return $competition;
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