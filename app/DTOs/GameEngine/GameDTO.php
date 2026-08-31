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
        public ?string $imgSrc = null,
        public ?bool $isActive = null,
        public ?int $staminaCost = null,
        public ?int $baseXp = null,
        public ?int $baseCoins = null,
        public ?int $basePoints = null,
        public ?int $timeLimitSeconds = null,
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
            imgSrc: $data['img_src'] ?? null,
            isActive: isset($data['is_active']) ? (bool) $data['is_active'] : null,
            staminaCost: isset($data['stamina_cost']) ? (int) $data['stamina_cost'] : null,
            baseXp: isset($data['base_xp']) ? (int) $data['base_xp'] : null,
            baseCoins: isset($data['base_coins']) ? (int) $data['base_coins'] : null,
            basePoints: isset($data['base_points']) ? (int) $data['base_points'] : null,
            timeLimitSeconds: isset($data['time_limit_seconds']) ? (int) $data['time_limit_seconds'] : null,
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
            'img_src' => $this->imgSrc,
            'is_active' => $this->isActive,
            'stamina_cost' => $this->staminaCost,
            'base_xp' => $this->baseXp,
            'base_coins' => $this->baseCoins,
            'base_points' => $this->basePoints,
            'time_limit_seconds' => $this->timeLimitSeconds,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}