<?php
namespace App\DTOs\Game\Game;

use Illuminate\Http\Request;

readonly class GameDTO
{

    public function __construct(
        public string $name,
        public string $slug,
        public string $description,
        public int $minPlayers,
        public int $maxPlayers,
        public ?bool $is_active=true,
        public ?array $config = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $data = $request->validated();

        return new self(
            name: $data['name'],
            slug: $data['slug'],
            description: $data['description'],
            is_active: $data['is_active'] ?? true,
            minPlayers: $data['min_players'],
            maxPlayers: $data['max_players'],
            config: $data['default_config'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'description'=>$this->description,
            'min_players' => $this->minPlayers,
            'max_players' => $this->maxPlayers,
            'is_active'=>$this->is_active,
            'default_config' => $this->config,
        ];
    }
}
