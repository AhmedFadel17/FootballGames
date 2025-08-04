<?php

namespace App\DTOs\Game\GameResult;

use App\Models\Game\GameResult;

class GameResultResponseDTO
{
    public readonly int $id;
    public readonly int $game_instance_id;
    public readonly int $user_id;
    public readonly int $score;
    public readonly int $rank;
    public readonly string $created_at;
    public readonly string $updated_at;

    public function __construct(
        int $id,
        int $game_instance_id,
        int $user_id,
        int $score,
        int $rank,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->game_instance_id = $game_instance_id;
        $this->user_id = $user_id;
        $this->score = $score;
        $this->rank = $rank;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(GameResult $gameResult): self
    {
        return new self(
            id: $gameResult->id ?? 0,
            game_instance_id: $gameResult->game_instance_id ?? 0,
            user_id: $gameResult->user_id ?? 0,
            score: $gameResult->score ?? 0,
            rank: $gameResult->rank ?? 0,
            created_at: $gameResult->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $gameResult->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'user_id' => $this->user_id,
            'score' => $this->score,
            'rank' => $this->rank,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
