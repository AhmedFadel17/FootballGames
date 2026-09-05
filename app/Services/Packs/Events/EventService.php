<?php
namespace App\Services\Packs\Events;

use App\DTOs\Packs\EventDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\Event;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EventService implements IEventService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Event::query(), $dto)
            ->allowFilters(['id', 'name', 'slug', 'is_active', 'starts_at', 'ends_at'])
            ->allowSorts(['id', 'name', 'starts_at', 'ends_at', 'created_at'])
            ->searchable(['name', 'slug'])
            ->paginate();
    }

    public function getOptions(?string $query = null, ?int $limit = 10): Collection
    {
        $term = trim($query);
        $searchable = strlen($term) >= 2;

        return Event::query()
            ->select(['id', 'name', 'slug', 'img_src'])
            ->where('is_active', true)
            ->when($searchable, function ($q) use ($term) {
                $q->where('name', 'ILIKE', "%{$term}%");
            })
            ->orderBy('name', 'asc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): Event
    {
        return Event::with(['packs', 'playerCards'])->findOrFail($id);
    }

    public function create(EventDTO $data): Event
    {
        $event = Event::create($data->toArray());
        return $event;
    }

    public function update($id, EventDTO $data): Event
    {
        $event = Event::findOrFail($id);
        $event->update($data->toUpdateArray());
        return $event;
    }

    public function delete($id): bool
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return true;
    }
}