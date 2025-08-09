<?php

namespace App\DTOs\Game\GameResult;

use App\Models\Game\GameResult;
use App\Shared\Enums\GameResultStatus;

class GameResultResponseDTO
{
    public readonly int $id;
    public readonly int $game_entry_id;
    public readonly int $score;
    public readonly int $rank;
    public readonly GameResultStatus $status;
    public readonly string $created_at;
    public readonly string $updated_at;

    public function __construct(
        int $id,
        int $game_entry_id,
        int $score,
        int $rank,
        GameResultStatus $status,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->game_entry_id = $game_entry_id;
        $this->score = $score;
        $this->status = $status;
        $this->rank = $rank;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(GameResult $gameResult): self
    {
        return new self(
            id: $gameResult->id ?? 0,
            game_entry_id: $gameResult->game_entry_id ?? 0,
            score: $gameResult->score ?? 0,
            rank: $gameResult->rank ?? 0,
            status: $gameResult->status ?? '',
            created_at: $gameResult->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $gameResult->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'game_entry_id' => $this->game_entry_id,
            'score' => $this->score,
            'rank' => $this->rank,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
