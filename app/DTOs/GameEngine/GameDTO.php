<?php
namespace App\DTOs\GameEngine;


use Illuminate\Foundation\Http\FormRequest;

class GameDTO
{
    public function __construct(
        public ?string $name = null,
        public ?int $minPlayers = null,
        public ?int $maxPlayers = null,
        public ?string $slug = null,
        public ?string $description = null,
        public ?bool $isActive = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'] ?? null,
            minPlayers: isset($data['min_players']) ? (int) $data['min_players'] : null,
            maxPlayers: isset($data['max_players']) ? (int) $data['max_players'] : null,
            slug: $data['slug'] ?? null,
            description: $data['description'] ?? null,
            isActive: isset($data['is_active']) ? (bool) $data['is_active'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'min_players' => $this->minPlayers,
            'max_players' => $this->maxPlayers,
            'slug' => $this->slug,
            'description' => $this->description,
            'is_active' => $this->isActive,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}