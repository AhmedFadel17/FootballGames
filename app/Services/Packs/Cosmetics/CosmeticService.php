<?php
namespace App\Services\Packs\Cosmetics;

use App\DTOs\Packs\CosmeticDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\Cosmetic;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CosmeticService implements ICosmeticService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Cosmetic::query(), $dto)
            ->allowFilters(['id', 'name', 'type', 'rarity', 'is_active'])
            ->allowSorts(['id', 'name', 'type', 'rarity', 'created_at'])
            ->searchable(['name', 'type'])
            ->paginate();
    }

    public function getOptions(?string $query = null, ?int $limit = 10): Collection
    {
        $term = trim($query);
        $searchable = strlen($term) >= 2;

        return Cosmetic::query()
            ->select(['id', 'name', 'type', 'img_src', 'rarity'])
            ->where('is_active', true)
            ->when($searchable, function ($q) use ($term) {
                $q->where('name', 'ILIKE', "%{$term}%");
            })
            ->orderBy('name', 'asc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): Cosmetic
    {
        return Cosmetic::findOrFail($id);
    }

    public function create(CosmeticDTO $data): Cosmetic
    {
        return Cosmetic::create($data->toArray());
    }

    public function update($id, CosmeticDTO $data): Cosmetic
    {
        $cosmetic = Cosmetic::findOrFail($id);
        $cosmetic->update($data->toUpdateArray());
        return $cosmetic;
    }

    public function delete($id): bool
    {
        $cosmetic = Cosmetic::findOrFail($id);
        $cosmetic->delete();
        return true;
    }
}