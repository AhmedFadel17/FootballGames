<?php

namespace App\DTOs\Game\Game;

use App\Models\Game\Game;

class GameResponseDTO
{
    public readonly int $id;
    public readonly string $title;
    public readonly string $description;
    public readonly bool $is_active;
    public readonly int $game_type_id;
    public readonly string $created_at;
    public readonly string $updated_at;
    public readonly string $type;
    public function __construct(
        int $id,
        string $title,
        string $description,
        bool $is_active,
        int $game_type_id,
        string $created_at,
        string $updated_at,
        string $type
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->is_active = $is_active;
        $this->game_type_id = $game_type_id;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
        $this->type=$type;
    }

    public static function fromModel(Game $game): self
    {
        return new self(
            id: $game->id ?? 0,
            title: $game->title ?? '',
            description: $game->description ?? '',
            is_active: $game->is_active ?? false,
            game_type_id: $game->game_type_id ?? 0,
            type: $game->type->name ?? null,
            created_at: $game->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $game->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'game_type_id' => $this->game_type_id,
            'type' => $this->game_type_name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
