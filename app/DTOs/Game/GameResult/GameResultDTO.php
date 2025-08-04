<?php

namespace App\DTOs\Game\GameResult;

class GameResultDTO
{
    public readonly int $game_instance_id;
    public readonly int $user_id;
    public readonly int $score;
    public readonly int $rank;

    public function __construct(array $data)
    {
        $this->game_instance_id = $data['game_instance_id'] ?? 0;
        $this->user_id = $data['user_id'] ?? 0;
        $this->score = $data['score'] ?? 0;
        $this->rank = $data['rank'] ?? 0;
    }

    public function toArray(): array
    {
        return [
            'game_instance_id' => $this->game_instance_id,
            'user_id' => $this->user_id,
            'score' => $this->score,
            'rank' => $this->rank,
        ];
    }
}
