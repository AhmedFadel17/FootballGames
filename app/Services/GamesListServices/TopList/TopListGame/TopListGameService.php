<?php
namespace App\Services\GamesListServices\TopList\TopListGame;

use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListItem;
use App\Models\User;
use App\Enums\GameEngine\GameDifficulty;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class TopListGameService implements ITopListGameService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(TopListGame::query()->with(['items.object', 'items.object.team', 'items.object.country']), $dto)
            ->allowFilters(['items_type', 'total_items', 'difficulty', 'title', 'description'])
            ->allowSorts(['id', 'items_type', 'total_items', 'difficulty', 'title', 'description'])
            ->searchable(['title', 'description'])
            ->paginate();
    }

    public function create(TopListGameDTO $dto): TopListGame
    {
        return DB::transaction(function () use ($dto) {
            $topListGame = TopListGame::create([
                'title' => $dto->title,
                'description' => $dto->description,
                'items_type' => $dto->items_type,
                'total_items' => count((array) $dto->items),
                'difficulty' => $dto->difficulty ?? GameDifficulty::EASY->value,
            ]);

            foreach ($dto->items as $item) {
                TopListItem::create([
                    'top_list_game_id' => $topListGame->id,
                    'rank' => $item['rank'] ?? $item['pos'],
                    'object_id' => $item['id'] ?? $item['object_id'],
                    'display_value' => $item['display_value'] ?? null,
                ]);
            }

            return $topListGame->load('items');
        });
    }

    public function getById($id): TopListGame
    {
        $topListGame = TopListGame::with([
            'items.object',
            'items.object.team',
            'items.object.country',
        ])->findOrFail($id);
        return $topListGame;
    }

    public function update($id, TopListGameDTO $data): TopListGame
    {
        $topListGame = TopListGame::findOrFail($id);
        $topListGame->update($data->toUpdateArray());
        $topListGame->load('items');
        return $topListGame;
    }
    public function delete($id): bool
    {
        $topListGame = TopListGame::findOrFail($id);
        $topListGame->delete();
        return true;
    }

    public function getRandom(User $user, GameDifficulty $difficulty): ?TopListGame
    {
        return TopListGame::with([
            'items.object',
            'items.object.team',
            'items.object.country',
        ])
            ->where('difficulty', $difficulty->value)
            ->whereDoesntHave('topListInstances.gameInstance.entries', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->inRandomOrder()
            ->first();
    }
}