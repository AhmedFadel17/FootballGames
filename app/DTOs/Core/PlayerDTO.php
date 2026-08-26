<?php

namespace App\DTOs\Core;

use Illuminate\Foundation\Http\FormRequest;

class PlayerDTO
{
    public function __construct(
        public ?string $name = null,
        public ?string $fullname = null,
        public ?int $position = null,
        public ?string $dateOfBirth = null,
        public ?string $imgSrc = null,
        public ?int $popularity = null,
        public ?int $apiId = null,
        public ?string $slug = null,
        public ?int $countryId = null,
        public ?int $heightCm = null,
        public ?int $weightKg = null,
        public ?int $rating = null,
        public ?int $marketValue = null,
        public ?int $preferredFoot = null,
        public ?bool $is_retired = null,
        public ?int $current_team_id = null,
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
            fullname: $data['fullname'] ?? null,
            position: isset($data['position']) ? (int) $data['position'] : null,
            dateOfBirth: $data['date_of_birth'] ?? null,
            imgSrc: $data['img_src'] ?? null,
            popularity: isset($data['popularity']) ? (int) $data['popularity'] : null,
            apiId: isset($data['api_id']) ? (int) $data['api_id'] : null,
            slug: $data['slug'] ?? null,
            countryId: isset($data['country_id']) ? (int) $data['country_id'] : null,
            heightCm: isset($data['height_cm']) ? (int) $data['height_cm'] : null,
            weightKg: isset($data['weight_kg']) ? (int) $data['weight_kg'] : null,
            rating: isset($data['rating']) ? (int) $data['rating'] : null,
            marketValue: isset($data['market_value']) ? (int) $data['market_value'] : null,
            preferredFoot: isset($data['preferred_foot']) ? (int) $data['preferred_foot'] : null,
            is_retired: isset($data['is_retired']) ? (bool) $data['is_retired'] : null,
            current_team_id: isset($data['current_team_id']) ? (int) $data['current_team_id'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'fullname' => $this->fullname,
            'position' => $this->position,
            'date_of_birth' => $this->dateOfBirth,
            'country_id' => $this->countryId,
            'img_src' => $this->imgSrc,
            'popularity' => $this->popularity,
            'slug' => $this->slug,
            'api_id' => $this->apiId,
            'height_cm' => $this->heightCm,
            'weight_kg' => $this->weightKg,
            'rating' => $this->rating,
            'market_value' => $this->marketValue,
            'preferred_foot' => $this->preferredFoot,
            'is_retired' => $this->is_retired,
            'current_team_id' => $this->current_team_id,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}