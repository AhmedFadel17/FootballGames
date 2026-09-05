<?php
namespace App\DTOs\Packs;

use Illuminate\Foundation\Http\FormRequest;

class PowerupDTO
{
    public function __construct(
        public ?string $slug = null,
        public ?string $name = null,
        public ?string $description = null,
        public ?string $imgSrc = null,
        public ?int $type = null,
        public ?int $rarity = null,
        public ?int $duration = null,
        public ?float $multiplier = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            slug: $data['slug'] ?? null,
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            imgSrc: $data['img_src'] ?? null,
            type: $data['type'] ?? null,
            rarity: $data['rarity'] ?? null,
            duration: $data['duration'] ?? null,
            multiplier: $data['multiplier'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'img_src' => $this->imgSrc,
            'type' => $this->type,
            'rarity' => $this->rarity,
            'duration' => $this->duration,
            'multiplier' => $this->multiplier,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}