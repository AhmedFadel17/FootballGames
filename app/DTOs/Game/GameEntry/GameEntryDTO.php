<?php

namespace App\DTOs\Game\GameEntry;

class GameEntryDTO
{
    public readonly int $user_id;
    public readonly int $game_instance_id;
    public readonly ?string $data;

    public function __construct(array $data)
    {
        $this->user_id = $data['user_id'] ?? 0;
        $this->game_instance_id = $data['game_instance_id'] ?? 0;
        $this->data = $data['data'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->user_id,
            'game_instance_id' => $this->game_instance_id,
            'data' => $this->data,
        ];
    }
}
