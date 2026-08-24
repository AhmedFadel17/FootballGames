<?php

namespace App\DTOs\GameEngine;

use App\Enums\GameEngine\GameResultStatus;
use Illuminate\Foundation\Http\FormRequest;

class GameResultDTO
{
    public function __construct(
        public ?int $gameEntryId = null,
        public ?int $score = null,
        public ?bool $isWinner = null,
        public ?int $rank = null,
        public ?GameResultStatus $status = null,
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
            $status = $data['status'] instanceof GameResultStatus
                ? $data['status']
                : GameResultStatus::tryFrom($data['status']);
        }

        return new self(
            gameEntryId: isset($data['game_entry_id']) ? (int) $data['game_entry_id'] : null,
            score: isset($data['score']) ? (int) $data['score'] : null,
            isWinner: isset($data['is_winner']) ? (bool) $data['is_winner'] : null,
            rank: isset($data['rank']) ? (int) $data['rank'] : null,
            status: $status,
        );
    }

    public function toArray(): array
    {
        return [
            'game_entry_id' => $this->gameEntryId,
            'score' => $this->score,
            'is_winner' => $this->isWinner,
            'rank' => $this->rank,
            'status' => $this->status?->value ?? $this->status,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}