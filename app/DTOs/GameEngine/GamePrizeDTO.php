<?php

namespace App\DTOs\GameEngine;

use Illuminate\Foundation\Http\FormRequest;

class GamePrizeDTO
{
    public function __construct(
        public ?int $gameInstanceId = null,
        public ?int $rank = null,
        public ?string $reward = null,
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
            rank: isset($data['rank']) ? (int) $data['rank'] : null,
            reward: $data['reward'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'game_instance_id' => $this->gameInstanceId,
            'rank' => $this->rank,
            'reward' => $this->reward,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}