<?php

namespace App\Services\GameServices\GameType;

use App\DTOs\Game\GameType\GameTypeDTO;
use App\DTOs\Game\GameType\GameTypeResponseDTO;
use App\Models\Game\GameType;

class GameTypeService implements IGameTypeService
{

    public function getAll(): array
    {
        $query = GameType::query();
        return $query->get()
            ->map(fn($game) => GameTypeResponseDTO::fromModel($game))
            ->all();
    }

    public function getAllWithGamesList(): array
    {
        $query = GameType::query();
        return $query->with('games')->get()
            ->map(fn($game) => GameTypeResponseDTO::fromModel($game))
            ->all();
    }


    public function getById(int $id): GameTypeResponseDTO
    {
        $gameType = GameType::findOrFail($id);
        return GameTypeResponseDTO::fromModel($gameType);
    }

    public function create(GameTypeDTO $dto): GameTypeResponseDTO
    {
        $gameType = GameType::create($dto->toArray());
        return GameTypeResponseDTO::fromModel($gameType);
    }

    public function update(int $id, GameTypeDTO $dto): GameTypeResponseDTO
    {
        $gameType = GameType::findOrFail($id);
        $gameType->update($dto->toArray());
        return GameTypeResponseDTO::fromModel($gameType);
    }

    public function delete(int $id): void
    {
        $gameType = GameType::findOrFail($id);
        $gameType->delete();
    }
}
