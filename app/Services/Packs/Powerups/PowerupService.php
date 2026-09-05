<?php

namespace App\Services\Packs\Powerups;

use App\DTOs\Packs\PowerupDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\Powerup;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PowerupService implements IPowerupService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Powerup::query(), $dto)
            ->allowFilters(['id', 'name', 'slug', 'type', 'rarity'])
            ->allowSorts(['id', 'name', 'rarity', 'created_at'])
            ->searchable(['name', 'slug'])
            ->paginate();
    }

    public function getOptions(?string $query = null, ?int $limit = 10): Collection
    {
        $term = trim($query);
        $searchable = strlen($term) >= 2;

        return Powerup::query()
            ->select(['id', 'name', 'slug', 'icon_src', 'rarity'])
            ->when($searchable, function ($q) use ($term) {
                $q->where('name', 'ILIKE', "%{$term}%");
            })
            ->orderBy('name', 'asc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): Powerup
    {
        return Powerup::findOrFail($id);
    }

    public function create(PowerupDTO $data): Powerup
    {
        return Powerup::create($data->toArray());
    }

    public function update($id, PowerupDTO $data): Powerup
    {
        $powerup = Powerup::findOrFail($id);
        $powerup->update($data->toUpdateArray());
        return $powerup;
    }

    public function delete($id): bool
    {
        $powerup = Powerup::findOrFail($id);
        $powerup->delete();
        return true;
    }
}
