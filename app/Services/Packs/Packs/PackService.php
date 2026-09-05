<?php
namespace App\Services\Packs\Packs;

use App\DTOs\Packs\OpenPackRequestDTO;
use App\DTOs\Packs\PackDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\Pack;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PackService implements IPackService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Pack::query()->with('event'), $dto)
            ->allowFilters(['id', 'name', 'event_id', 'is_active', 'price_coins'])
            ->allowSorts(['id', 'name', 'price_coins', 'created_at'])
            ->searchable(['name', 'description'])
            ->paginate();
    }

    public function getOptions(?string $query = null, ?int $limit = 10): Collection
    {
        $term = trim($query);
        $searchable = strlen($term) >= 2;

        return Pack::query()
            ->select(['id', 'name', 'price_coins', 'cards_count', 'img_src'])
            ->where('is_active', true)
            ->when($searchable, function ($q) use ($term) {
                $q->where('name', 'ILIKE', "%{$term}%");
            })
            ->orderBy('price_coins', 'asc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): Pack
    {
        return Pack::with(['event', 'dropRules'])->findOrFail($id);
    }

    public function create(PackDTO $data): Pack
    {
        $pack = Pack::create($data->toArray());
        $pack->load('event');
        return $pack;
    }

    public function update($id, PackDTO $data): Pack
    {
        $pack = Pack::findOrFail($id);
        $pack->update($data->toUpdateArray());
        $pack->load('event');
        return $pack;
    }

    public function delete($id): bool
    {
        $pack = Pack::findOrFail($id);
        $pack->delete();
        return true;
    }

    public function openPack(OpenPackRequestDTO $dto): array
    {
        $pack = Pack::with('dropRules')->findOrFail($dto->packId);

        // Perform drop rate resolution & item generation logic here
        return [
            'pack_id' => $pack->id,
            'items' => [],
        ];
    }
}