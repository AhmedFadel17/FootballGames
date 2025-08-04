<?php

namespace App\DTOs\Game\GamePrize;

class GamePrizeDTO
{
    public readonly int $game_instance_id;
    public readonly int $rank;
    public readonly string $reward;

    public function __construct(array $data)
    {
        $this->game_instance_id = $data['game_instance_id'] ?? 0;
        $this->rank = $data['rank'] ?? 0;
        $this->reward = $data['reward'] ?? '';
    }

    public function toArray(): array
    {
        return [
            'game_instance_id' => $this->game_instance_id,
            'rank' => $this->rank,
            'reward' => $this->reward,
        ];
    }
}
