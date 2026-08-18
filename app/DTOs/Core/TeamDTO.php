<?php

namespace App\DTOs\Core;

use Illuminate\Foundation\Http\FormRequest;

class TeamDTO
{
    public function __construct(
        public ?string $name = null,
        public ?string $abbr = null,
        public ?int $countryId = null,
        public ?string $imgSrc = null,
        public ?int $popularity = null,
        public ?string $slug = null,
        public ?int $apiId = null,
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
            abbr: $data['abbr'] ?? null,
            countryId: isset($data['country_id']) ? (int) $data['country_id'] : null,
            imgSrc: $data['img_src'] ?? null,
            popularity: isset($data['popularity']) ? (int) $data['popularity'] : null,
            slug: $data['slug'] ?? null,
            apiId: isset($data['api_id']) ? (int) $data['api_id'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'abbr' => $this->abbr,
            'country_id' => $this->countryId,
            'img_src' => $this->imgSrc,
            'popularity' => $this->popularity,
            'slug' => $this->slug,
            'api_id' => $this->apiId,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}