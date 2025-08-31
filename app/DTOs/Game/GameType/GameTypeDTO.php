<?php

namespace App\DTOs\Game\GameType;

class GameTypeDTO
{
    public readonly string $name;
    public readonly string $slug;
    public readonly ?string $description;
    public function __construct(array $data)
    {
        $this->name = $data['name'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->slug= $data['slug'] ?? '';

    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'slug' => $this->slug,
        ];
    }
}
