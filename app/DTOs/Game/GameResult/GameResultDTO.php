<?php

namespace App\DTOs\Game\GameResult;

use App\Shared\Enums\GameResultStatus;

class GameResultDTO
{
    public readonly int $game_entry_id; 
    public readonly int $user_id;
    public readonly int $score;
    public readonly int $rank;
    public readonly GameResultStatus $status;

    public function __construct(array $data)
    {
        $this->game_entry_id = $data['game_entry_id'] ?? 0;
        $this->user_id = $data['user_id'] ?? 0;
        $this->score = $data['score'] ?? 0;
        $this->rank = $data['rank'] ?? 0;

        $statusData = $data['status'] ?? GameResultStatus::PLAYING;
        $this->status = $statusData instanceof GameResultStatus 
            ? $statusData 
            : GameResultStatus::from($statusData);
    }

    public function toArray(): array
    {
        return [
            'game_entry_id' => $this->game_entry_id,
            'user_id' => $this->user_id,
            'score' => $this->score,
            'rank' => $this->rank,
            'status' => $this->status->value, 
        ];
    }
}