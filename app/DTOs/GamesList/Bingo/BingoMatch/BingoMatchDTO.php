<?php

namespace App\DTOs\GamesList\Bingo\BingoMatch;

class BingoMatchDTO
{
    public readonly int $bingo_game_id;
    public readonly int $player_id;
    public readonly int $pos;

    public function __construct(array $data)
    {
        $this->bingo_game_id = $data['bingo_game_id'] ?? 0;
        $this->player_id = $data['player_id'] ?? 0;
        $this->pos = $data['pos'] ?? 0;
    }

    public function toArray(): array
    {
        return [
            'bingo_game_id' => $this->bingo_game_id,
            'player_id' => $this->player_id,
            'pos' => $this->pos,
        ];
    }
}
