<?php

namespace App\Services\GameEngine\Games;

use App\Models\GameEngine\Game;
use App\DTOs\GameEngine\GameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
class GameService implements IGameService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Game::query(), $dto)
            ->allowFilters(['min_players', 'max_players', 'name', 'slug', 'is_active'])
            ->allowSorts(['id', 'name', 'min_players', 'max_players', 'slug', 'description', 'is_active'])
            ->searchable(['name', 'slug'])
            ->paginate();
    }


    public function getById(int $id): Game
    {
        $game = Game::findOrFail($id);
        return $game;
    }

    public function create(GameDTO $dto): Game
    {
        $game = Game::create($dto->toArray());
        return $game;
    }

    public function update(int $id, GameDTO $dto): Game
    {
        $game = Game::findOrFail($id);
        $game->update($dto->toArray());
        return $game;
    }

    public function delete(int $id): void
    {
        $game = Game::findOrFail($id);
        $game->delete();
    }
}
