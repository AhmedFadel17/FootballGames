<?php

namespace App\DTOs\GameEngine;

use Illuminate\Foundation\Http\FormRequest;

class GameEntryDTO
{
    public function __construct(
        public ?int $userId = null,
        public ?int $gameInstanceId = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        return new self(
            userId: isset($data['user_id']) ? (int) $data['user_id'] : null,
            gameInstanceId: isset($data['game_instance_id']) ? (int) $data['game_instance_id'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'game_instance_id' => $this->gameInstanceId,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}