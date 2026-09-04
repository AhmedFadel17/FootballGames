<?php

namespace App\Services\Core\Managers;

use App\DTOs\Core\ManagerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Manager;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ManagerService implements IManagerService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Manager::query()->with(['country', 'currentTeam']), $dto)
            ->allowFilters(['country_id', 'popularity', 'name', 'slug', 'current_team_id', 'country_id', 'is_retired', 'api_id'])
            ->allowSorts(['id', 'name', 'slug', 'country_id', 'popularity', 'current_team_id', 'country_id', 'is_retired', 'api_id', 'created_at'])
            ->searchable(['name', 'slug'])
            ->paginate();
    }

    public function getOptions(string $query, int $limit = 10): Collection
    {
        $term = trim($query);

        if (strlen($term) < 2) {
            return collect();
        }

        return Manager::query()
            ->select(['id', 'name', 'img_src', 'popularity'])
            ->where('name', 'ILIKE', "%{$term}%")
            ->orderBy('popularity', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): Manager
    {
        $manager = Manager::with(['country', 'teamPeriods.team'])->findOrFail($id);
        return $manager;
    }

    public function create(ManagerDTO $data): Manager
    {
        $manager = Manager::create($data->toArray());
        return $manager;
    }

    public function update($id, ManagerDTO $data): Manager
    {
        $manager = Manager::findOrFail($id);
        $manager->update($data->toUpdateArray());
        return $manager;
    }

    public function delete($id): bool
    {
        $manager = Manager::findOrFail($id);
        $manager->delete();
        return true;
    }

    public function getRandom(int $minPopularity, bool $includeRetired, int $limit): Collection
    {
        return Manager::query()
            ->where('popularity', '>=', $minPopularity)
            ->when(!$includeRetired, fn($q) => $q->where('is_retired', false))
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }
}