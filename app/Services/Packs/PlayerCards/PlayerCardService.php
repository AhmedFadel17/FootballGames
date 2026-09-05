<?php

namespace App\Services\Packs\PlayerCards;

use App\DTOs\Packs\PlayerCardDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\PlayerCard;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PlayerCardService implements IPlayerCardService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(PlayerCard::query()->with(['player', 'event']), $dto)
            ->allowFilters(['id', 'player_id', 'event_id', 'rating', 'rarity', 'position'])
            ->allowSorts(['id', 'rating', 'rarity', 'created_at'])
            ->searchable(['player.name'])
            ->paginate();
    }

    public function getOptions(?string $query = null, ?int $limit = 10): Collection
    {
        $term = trim($query);
        $searchable = strlen($term) >= 2;

        return PlayerCard::query()
            ->with(['player:id,name'])
            ->select(['id', 'player_id', 'rating', 'rarity', 'img_src'])
            ->when($searchable, function ($q) use ($term) {
                $q->whereHas('player', function ($pq) use ($term) {
                    $pq->where('name', 'ILIKE', "%{$term}%");
                });
            })
            ->orderBy('rating', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): PlayerCard
    {
        return PlayerCard::with(['player', 'event'])->findOrFail($id);
    }

    public function create(PlayerCardDTO $data): PlayerCard
    {
        $card = PlayerCard::create($data->toArray());
        $card->load(['player', 'event']);
        return $card;
    }

    public function update($id, PlayerCardDTO $data): PlayerCard
    {
        $card = PlayerCard::findOrFail($id);
        $card->update($data->toUpdateArray());
        $card->load(['player', 'event']);
        return $card;
    }

    public function delete($id): bool
    {
        $card = PlayerCard::findOrFail($id);
        $card->delete();
        return true;
    }
}