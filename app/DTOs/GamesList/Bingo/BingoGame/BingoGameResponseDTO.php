<?php

namespace App\DTOs\GamesList\Bingo\BingoGame;

use App\Models\GamesList\Bingo\BingoGame;

class BingoGameResponseDTO
{
    public readonly int $id;
    public readonly int $game_instance_id;
    public readonly int $size;
    public readonly int $remaining_answers;
    public readonly string $created_at;
    public readonly string $updated_at;

    public function __construct(
        int $id,
        int $game_instance_id,
        int $size,
        int $remaining_answers,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->game_instance_id = $game_instance_id;
        $this->size = $size;
        $this->remaining_answers = $remaining_answers;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(BingoGame $bingoGame): self
    {
        return new self(
            id: $bingoGame->id ?? 0,
            game_instance_id: $bingoGame->game_instance_id ?? 0,
            size: $bingoGame->size ?? 0,
            remaining_answers: $bingoGame->remaining_answers ?? 0,
            created_at: $bingoGame->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $bingoGame->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'size' => $this->size,
            'remaining_answers' => $this->remaining_answers,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
