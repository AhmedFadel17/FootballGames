<?php
namespace App\DTOs\Packs;

use Illuminate\Foundation\Http\FormRequest;

class PowerupDTO
{
    public function __construct(
        public ?string $slug = null,
        public ?string $name = null,
        public ?string $description = null,
        public ?string $iconSrc = null,
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
            iconSrc: $data['icon_src'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'icon_src' => $this->iconSrc,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}