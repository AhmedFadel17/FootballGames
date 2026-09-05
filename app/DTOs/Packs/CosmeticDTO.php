<?php

namespace App\DTOs\Packs;

use Illuminate\Foundation\Http\FormRequest;

class CosmeticDTO
{
    public function __construct(
        public ?int $type = null,
        public ?string $slug = null,
        public ?string $name = null,
        public ?string $description = null,
        public ?string $imgSrc = null,
        public ?int $rarity = null,
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
            type: isset($data['type']) ? (int) $data['type'] : null,
            slug: $data['slug'] ?? null,
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            imgSrc: $data['img_src'] ?? null,
            rarity: isset($data['rarity']) ? (int) $data['rarity'] : null,
            isActive: isset($data['is_active']) ? (bool) $data['is_active'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'img_src' => $this->imgSrc,
            'rarity' => $this->rarity,
            'is_active' => $this->isActive,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}