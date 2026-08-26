<?php

namespace App\DTOs\Core;

use Illuminate\Foundation\Http\FormRequest;

class CountryDTO
{
    public function __construct(
        public ?string $name = null,
        public ?string $code = null,
        public ?string $img_src = null,
        public ?int $popularity = null,
        public ?int $continentId = null,
        public ?bool $is_federation = null,
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
            code: $data['code'] ?? null,
            img_src: $data['img_src'] ?? null,
            popularity: isset($data['popularity']) ? (int) $data['popularity'] : null,
            continentId: isset($data['continent_id']) ? (int) $data['continent_id'] : null,
            is_federation: isset($data['is_federation']) ? (bool) $data['is_federation'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'code' => $this->code,
            'img_src' => $this->img_src,
            'popularity' => $this->popularity,
            'continent_id' => $this->continentId,
            'is_federation' => $this->is_federation,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}