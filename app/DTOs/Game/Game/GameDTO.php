<?php

namespace App\DTOs\Game\Game;

class GameDTO
{
    public readonly string $title;
    public readonly string $description;
    public readonly bool $is_active;

    public readonly int $game_type_id;
    public function __construct(array $data)
    {
        $this->title = $data['title'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->is_active = $data['is_active'] ?? false;
        $this->game_type_id = $data['game_type_id'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'game_type_id' => $this->game_type_id,
        ];
    }
}
