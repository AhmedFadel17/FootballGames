<?php

namespace App\DTOs\Core;

use Illuminate\Foundation\Http\FormRequest;

readonly class CompetitionDTO
{
    public function __construct(
        public ?string $name = null,
        public ?string $abbr = null,
        public ?int $countryId = null,
        public ?string $type = null,
        public ?int $foundedYear = null,
        public ?int $tier = null,
        public ?string $imgSrc = null,
        public ?int $popularity = null,
        public ?string $slug = null,
        public ?int $apiId = null,
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
            abbr: $data['abbr'] ?? null,
            countryId: isset($data['country_id']) ? (int) $data['country_id'] : null,
            type: $data['type'] ?? null,
            foundedYear: isset($data['founded_year']) ? (int) $data['founded_year'] : null,
            tier: isset($data['tier']) ? (int) $data['tier'] : null,
            imgSrc: $data['img_src'] ?? null,
            popularity: isset($data['popularity']) ? (int) $data['popularity'] : null,
            slug: $data['slug'] ?? null,
            apiId: isset($data['api_id']) ? (int) $data['api_id'] : null,
            isActive: isset($data['is_active']) ? (bool) $data['is_active'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'abbr' => $this->abbr,
            'country_id' => $this->countryId,
            'type' => $this->type,
            'founded_year' => $this->foundedYear,
            'tier' => $this->tier,
            'img_src' => $this->imgSrc,
            'popularity' => $this->popularity,
            'slug' => $this->slug,
            'api_id' => $this->apiId,
            'is_active' => $this->isActive,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}