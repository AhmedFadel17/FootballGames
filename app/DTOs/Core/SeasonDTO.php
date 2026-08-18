<?php

namespace App\DTOs\Core;

use Illuminate\Foundation\Http\FormRequest;

class SeasonDTO
{
    public function __construct(
        public ?string $name = null,
        public ?int $startYear = null,
        public ?int $endYear = null,
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
            startYear: isset($data['start_year']) ? (int) $data['start_year'] : null,
            endYear: isset($data['end_year']) ? (int) $data['end_year'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'start_year' => $this->startYear,
            'end_year' => $this->endYear,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}