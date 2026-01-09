<?php

namespace App\Services\GameServices\Game;

use App\Models\Game\Game;
use App\Services\Pagination\IPaginationService;
use App\DTOs\Game\Game\GameDTO;
use App\DTOs\Game\Game\GameResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Resources\GameStructure\Game\GameResource;

class GameService implements IGameService
{
    /**
     * @param array $dto
     * @return GameResponseDTO[]
     */
    public function getAll(array $dto): array
    {
        $query = Game::query();
        return $query->get()
            ->map(fn($game) => GameResource::make($game))
            ->all();
    }


    public function getById(int $id): GameResource
    {
        $game = Game::findOrFail($id);
        return GameResource::make($game);
    }

    public function create(GameDTO $dto): GameResource
    {
        $game = Game::create($dto->toArray());
        return GameResource::make($game);
    }

    public function update(int $id, GameDTO $dto): GameResource
    {
        $game = Game::findOrFail($id);
        $game->update($dto->toArray());
        return GameResource::make($game);
    }

    public function delete(int $id): void
    {
        $game = Game::findOrFail($id);
        $game->delete();
    }
}
