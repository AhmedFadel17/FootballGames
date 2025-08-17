<?php

namespace App\Services\GameServices\Game;

use App\Models\Game\Game;
use App\Services\Pagination\IPaginationService;
use App\DTOs\Game\Game\GameDTO;
use App\DTOs\Game\Game\GameResponseDTO;
use App\DTOs\Pagination\PaginationDTO;

class GameService implements IGameService
{
    /**
     * @param array $dto
     * @return GameResponseDTO[]
     */
    public function getAll(array $dto): array
    {
        $query = Game::query();

        if (!empty($dto['game_type_id'])) {
            $query->where('game_type_id', $dto['game_type_id']);
        }

        return $query->with('type')->get()
            ->map(fn($game) => GameResponseDTO::fromModel($game))
            ->all();
    }


    public function getById(int $id): GameResponseDTO
    {
        $game = Game::findOrFail($id);
        return GameResponseDTO::fromModel($game);
    }

    public function create(GameDTO $dto): GameResponseDTO
    {
        $game = Game::create($dto->toArray());
        return GameResponseDTO::fromModel($game);
    }

    public function update(int $id, GameDTO $dto): GameResponseDTO
    {
        $game = Game::findOrFail($id);
        $game->update($dto->toArray());
        return GameResponseDTO::fromModel($game);
    }

    public function delete(int $id): void
    {
        $game = Game::findOrFail($id);
        $game->delete();
    }
}
