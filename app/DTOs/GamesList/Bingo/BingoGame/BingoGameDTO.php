<?php

namespace App\DTOs\GamesList\Bingo\BingoGame;

class BingoGameDTO
{
    public readonly int $game_instance_id;
    public readonly int $size;
    public readonly int $remaining_answers;

    public function __construct(array $data)
    {
        $this->game_instance_id = $data['game_instance_id'] ?? 0;
        $this->size = $data['size'] ?? 0;
        $this->remaining_answers = $data['remaining_answers'] ?? 0;
    }

    public function toArray(): array
    {
        return [
            'game_instance_id' => $this->game_instance_id,
            'size' => $this->size,
            'remaining_answers' => $this->remaining_answers,
        ];
    }
}
