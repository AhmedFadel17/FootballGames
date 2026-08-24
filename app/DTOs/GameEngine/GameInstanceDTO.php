<?php

namespace App\DTOs\GameEngine;

use App\Enums\GameEngine\GameStatus;
use Illuminate\Foundation\Http\FormRequest;

class GameInstanceDTO
{
    public function __construct(
        public ?int $gameId = null,
        public ?string $startAt = null,
        public ?string $endAt = null,
        public ?GameStatus $status = null,
        public ?string $roomCode = null,
        public ?int $creatorId = null,
        public ?int $maxPlayers = null,
    ) {
    }

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    public static function fromArray(array $data): self
    {
        $status = null;
        if (isset($data['status'])) {
            $status = $data['status'] instanceof GameStatus
                ? $data['status']
                : GameStatus::tryFrom($data['status']);
        }

        return new self(
            gameId: isset($data['game_id']) ? (int) $data['game_id'] : null,
            startAt: $data['start_at'] ?? null,
            endAt: $data['end_at'] ?? null,
            status: $status,
            roomCode: $data['room_code'] ?? null,
            creatorId: isset($data['creator_id']) ? (int) $data['creator_id'] : null,
            maxPlayers: isset($data['max_players']) ? (int) $data['max_players'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'game_id' => $this->gameId,
            'start_at' => $this->startAt,
            'end_at' => $this->endAt,
            'status' => $this->status?->value ?? $this->status,
            'room_code' => $this->roomCode,
            'creator_id' => $this->creatorId,
            'max_players' => $this->maxPlayers,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}