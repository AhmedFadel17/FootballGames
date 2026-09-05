<?php

namespace App\DTOs\Packs;

use Illuminate\Foundation\Http\FormRequest;

class EventDTO
{
    public function __construct(
        public ?string $slug = null,
        public ?string $name = null,
        public ?bool $isActive = null,
        public ?string $startDate = null,
        public ?string $endDate = null,
        public ?string $imgSrc = null,
        public ?string $themeColor = null,
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
            isActive: isset($data['is_active']) ? (bool) $data['is_active'] : null,
            startDate: $data['start_date'] ?? null,
            endDate: $data['end_date'] ?? null,
            imgSrc: $data['img_src'] ?? null,
            themeColor: $data['theme_color'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'is_active' => $this->isActive,
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
            'img_src' => $this->imgSrc,
            'theme_color' => $this->themeColor,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}