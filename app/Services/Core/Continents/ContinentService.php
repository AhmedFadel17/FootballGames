<?php

namespace App\Services\Core\Continents;

use App\DTOs\Core\ContinentDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Continent;
use App\Services\Pagination\IPaginationService;
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
            ->allowFilters(['id', 'name', 'code'])
            ->allowSorts(['id', 'name', 'code'])
            ->searchable(['name', 'code'])
            ->paginate();
    }

    public function getById($id): Continent
    {
        $continent = Cache::remember("continent:$id", 3600, function () use ($id) {
            return Continent::findOrFail($id);
        });
        return $continent;
    }

    public function create(ContinentDTO $data): Continent
    {
        $continent = Continent::create($data->toArray());
        $this->resetCache();
        return $continent;
    }

    public function update($id, ContinentDTO $data): Continent
    {
        $continent = Continent::findOrFail($id);
        $continent->update($data->toUpdateArray());
        $this->resetCache($id);
        return $continent;
    }

    public function delete($id): bool
    {
        $continent = Continent::findOrFail($id);
        $continent->delete();
        $this->resetCache($id);
        return true;
    }

    private function resetCache($id = null)
    {
        $tableName = (new Continent())->getTable();
        Cache::tags([$tableName])->flush();
        if ($id) {
            Cache::forget("continent:$id");
        }
    }
}
