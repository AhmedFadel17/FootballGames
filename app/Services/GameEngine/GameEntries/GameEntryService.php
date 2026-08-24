<?php

namespace App\Services\GameEngine\GameEntries;

use App\DTOs\GameEngine\GameEntryDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GameEngine\GameEntry;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GameEntryService implements IGameEntryService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $paginationDTO): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(GameEntry::query(), $paginationDTO)
            ->allowFilters(['user_id', 'game_instance_id'])
            ->allowSorts(['id', 'user_id', 'game_instance_id'])
            ->searchable(['user_id', 'game_instance_id'])
            ->paginate();
    }

    public function getById(int $id): GameEntry
    {
        $gameEntry = GameEntry::findOrFail($id);
        return $gameEntry;
    }

    public function create(GameEntryDTO $dto): GameEntry
    {
        $gameEntry = GameEntry::create($dto->toArray());
        return $gameEntry;
    }

    public function update(int $id, GameEntryDTO $dto): GameEntry
    {
        $gameEntry = GameEntry::findOrFail($id);
        $gameEntry->update($dto->toArray());
        return $gameEntry;
    }

    public function delete(int $id): void
    {
        $gameEntry = GameEntry::findOrFail($id);
        $gameEntry->delete();
    }
}