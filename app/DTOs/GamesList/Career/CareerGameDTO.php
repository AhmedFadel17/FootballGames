<?php
namespace App\DTOs\GamesList\Career;


use Illuminate\Foundation\Http\FormRequest;

class CareerGameDTO
{
    public function __construct(
        public ?int $difficulty = null,
        public ?int $playerId = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            difficulty: isset($data['difficulty']) ? (int) $data['difficulty'] : null,
            playerId: isset($data['player_id']) ? (int) $data['player_id'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'difficulty' => $this->difficulty,
            'player_id' => $this->playerId,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}