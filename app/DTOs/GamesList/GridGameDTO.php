<?php
namespace App\DTOs\GamesList;


use Illuminate\Foundation\Http\FormRequest;

class GridGameDTO
{
    public function __construct(
        public ?int $gameInstanceId = null,
        public ?int $size = null,
        public ?int $difficulty = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            gameInstanceId: isset($data['game_instance_id']) ? (int) $data['game_instance_id'] : null,
            size: isset($data['size']) ? (int) $data['size'] : null,
            difficulty: isset($data['difficulty']) ? (int) $data['difficulty'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'game_instance_id' => $this->gameInstanceId,
            'size' => $this->size,
            'difficulty' => $this->difficulty,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}