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
        public ?int $durationSeconds = null,
        public ?int $earnedXp = null,
        public ?int $earnedCoins = null,
        public ?int $earnedPoints = null,
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
            durationSeconds: isset($data['duration_seconds']) ? (int) $data['duration_seconds'] : null,
            earnedXp: isset($data['earned_xp']) ? (int) $data['earned_xp'] : null,
            earnedCoins: isset($data['earned_coins']) ? (int) $data['earned_coins'] : null,
            earnedPoints: isset($data['earned_points']) ? (int) $data['earned_points'] : null,
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
            'duration_seconds' => $this->durationSeconds,
            'earned_xp' => $this->earnedXp,
            'earned_coins' => $this->earnedCoins,
            'earned_points' => $this->earnedPoints,
        ];
    }

    public function toUpdateArray(): array
    {
        return array_filter($this->toArray(), fn($value) => $value !== null);
    }
}