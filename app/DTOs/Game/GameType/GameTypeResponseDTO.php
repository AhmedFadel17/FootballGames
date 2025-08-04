<?php

namespace App\DTOs\Game\GameType;

use App\Models\Game\GameType;

class GameTypeResponseDTO
{
    public readonly int $id;
    public readonly string $name;
    public readonly string $description;
    public readonly string $created_at;
    public readonly string $updated_at;
    public function __construct(
        int $id,
        string $name,
        ?string $description,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(GameType $gameType): self
    {
        return new self(
            id: $gameType->id,
            name: $gameType->name,
            description: $gameType->description,
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 