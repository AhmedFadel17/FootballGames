<?php

namespace App\DTOs\GamesList\Bingo\BingoMatch;

use App\Models\GamesList\Bingo\BingoMatch;

class BingoMatchResponseDTO
{
    public readonly int $id;
    public readonly int $bingo_game_id;
    public readonly int $player_id;
    public readonly int $pos;
    public readonly string $created_at;
    public readonly string $updated_at;

    public function __construct(
        int $id,
        int $bingo_game_id,
        int $player_id,
        int $pos,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->bingo_game_id = $bingo_game_id;
        $this->player_id = $player_id;
        $this->pos = $pos;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(BingoMatch $bingoMatch): self
    {
        return new self(
            id: $bingoMatch->id ?? 0,
            bingo_game_id: $bingoMatch->bingo_game_id ?? 0,
            player_id: $bingoMatch->player_id ?? 0,
            pos: $bingoMatch->pos ?? 0,
            created_at: $bingoMatch->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $bingoMatch->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'bingo_game_id' => $this->bingo_game_id,
            'player_id' => $this->player_id,
            'pos' => $this->pos,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
