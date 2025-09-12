<?php

namespace App\Services\Continent;

use App\DTOs\Core\Continent\ContinentDTO;
use App\DTOs\Core\Continent\ContinentResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Continent;
use App\Services\Pagination\IPaginationService;
use Illuminate\Support\Facades\Cache;

class ContinentService implements IContinentService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['name', 'code', 'id'];
        $searchableFields = ['name', 'code'];

        return $this->_paginationService
            ->paginate(Continent::query(), $dto, ContinentResponseDTO::class, $allowedFilters, $searchableFields, 3600);
    }

    public function getById($id): ContinentResponseDTO
    {
        $continent = Cache::remember("continent:$id", 3600, function () use ($id) {
            return Continent::findOrFail($id);
        });
        return new ContinentResponseDTO($continent);
    }

    public function create(ContinentDTO $data): ContinentResponseDTO
    {
        $continent = Continent::create($data->toArray());
        $this->resetCache();
        return new ContinentResponseDTO($continent);
    }

    public function update($id, ContinentDTO $data): ContinentResponseDTO
    {
        $continent = Continent::findOrFail($id);
        $continent->update($data->toArray());
        $this->resetCache($id);
        return new ContinentResponseDTO($continent);
    }

    public function delete($id): bool
    {
        $continent = Continent::findOrFail($id);
        $continent->delete();
        $this->resetCache($id);
        return true;
    }

    private function resetCache($id=null)
    {
        $tableName = (new Continent())->getTable();
        Cache::tags([$tableName])->flush();
        if($id){
            Cache::forget("continent:$id");
        }
    }
}
