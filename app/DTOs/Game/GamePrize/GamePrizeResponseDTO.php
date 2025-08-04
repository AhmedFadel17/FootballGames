<?php

namespace App\DTOs\Game\GamePrize;

use App\Models\Game\GamePrize;

class GamePrizeResponseDTO
{
    public readonly int $id;
    public readonly int $game_instance_id;
    public readonly int $rank;
    public readonly string $reward;
    public readonly string $created_at;
    public readonly string $updated_at;

    public function __construct(
        int $id,
        int $game_instance_id,
        int $rank,
        string $reward,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->game_instance_id = $game_instance_id;
        $this->rank = $rank;
        $this->reward = $reward;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(GamePrize $gamePrize): self
    {
        return new self(
            id: $gamePrize->id ?? 0,
            game_instance_id: $gamePrize->game_instance_id ?? 0,
            rank: $gamePrize->rank ?? 0,
            reward: $gamePrize->reward ?? '',
            created_at: $gamePrize->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $gamePrize->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'rank' => $this->rank,
            'reward' => $this->reward,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
