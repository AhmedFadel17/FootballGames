<?php

namespace App\DTOs\Game\GameInstance;

class GameInstanceDTO
{
    public readonly int $game_id;
    public readonly string $start_at;
    public readonly ?string $end_at;
    public readonly string $status;

    public function __construct(array $data)
    {
        $this->game_id = $data['game_id'] ?? 0;
        $this->start_at = $data['start_at'] ?? '';
        $this->end_at = $data['end_at'] ?? null;
        $this->status = $data['status'] ?? '';
    }

    public function toArray(): array
    {
        return [
            'game_id' => $this->game_id,
            'start_at' => $this->start_at,
            'end_at' => $this->end_at,
            'status' => $this->status,
        ];
    }
}
