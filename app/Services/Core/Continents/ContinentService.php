<?php

namespace App\Services\Core\Continents;

use App\DTOs\Core\ContinentDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Continent;
use App\Services\Pagination\IPaginationService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ContinentService implements IContinentService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Continent::query(), $dto)
            ->allowFilters(['id', 'name', 'code', 'popularity'])
            ->allowSorts(['id', 'name', 'code', 'popularity'])
            ->searchable(['name', 'code'])
            ->paginate();
    }

    public function getById($id): Continent
    {
        $continent = Continent::findOrFail($id);
        return $continent;
    }

    public function create(ContinentDTO $data): Continent
    {
        $continent = Continent::create($data->toArray());
        return $continent;
    }

    public function update($id, ContinentDTO $data): Continent
    {
        $continent = Continent::findOrFail($id);
        $continent->update($data->toUpdateArray());
        return $continent;
    }

    public function delete($id): bool
    {
        $continent = Continent::findOrFail($id);
        $continent->delete();
        return true;
    }

    public function getRandom(int $minPopularity, int $limit): Collection
    {
        return Continent::query()
            ->where('popularity', '>=', $minPopularity)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }
}
