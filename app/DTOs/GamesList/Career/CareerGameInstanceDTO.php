<?php
namespace App\DTOs\GamesList\Career;


use Illuminate\Foundation\Http\FormRequest;

class CareerGameInstanceDTO
{
    public function __construct(
        public ?int $gameInstanceId = null,
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
            difficulty: isset($data['difficulty']) ? (int) $data['difficulty'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'game_instance_id' => $this->gameInstanceId,
            'difficulty' => $this->difficulty,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}