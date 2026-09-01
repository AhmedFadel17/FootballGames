<?php
namespace App\DTOs\GamesList\Grid;


use Illuminate\Foundation\Http\FormRequest;

class GridGameDTO
{
    public function __construct(
        public ?int $size = null,
        public ?int $difficulty = null,
        public ?array $conditions = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            size: isset($data['size']) ? (int) $data['size'] : null,
            difficulty: isset($data['difficulty']) ? (int) $data['difficulty'] : null,
            conditions: isset($data['conditions']) ? (array) $data['conditions'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'size' => $this->size,
            'difficulty' => $this->difficulty,
            'conditions' => $this->conditions,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}