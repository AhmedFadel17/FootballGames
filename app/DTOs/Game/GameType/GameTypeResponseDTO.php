<?php

namespace App\DTOs\Game\GameType;

use App\DTOs\Game\Game\GameResponseDTO;
use App\Models\Game\GameType;

class GameTypeResponseDTO
{
    public readonly int $id;
    public readonly string $name;
    public readonly string $slug;
    public readonly string $description;
    public readonly string $created_at;
    public readonly string $updated_at;
    public readonly array $games;

    public function __construct(
        int $id,
        string $name,
        string $slug,
        ?string $description,
        ?array $games,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->slug = $slug;
        $this->description = $description;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
        $this->games=$games;
    }

    public static function fromModel(GameType $gameType): self
    {
        return new self(
            id: $gameType->id,
            name: $gameType->name,
            slug: $gameType->slug,
            description: $gameType->description,
            games: $gameType->games->map(fn($game) => GameResponseDTO::fromModel($game))->toArray(),
            created_at: $gameType->created_at,
            updated_at: $gameType->updated_at
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'games' => array_map(fn($game) => $game->toArray(), $this->games),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 