<?php

namespace App\DTOs\GamesList\Bingo\BingoCondition;

use App\Models\GamesList\Bingo\BingoCondition;

class BingoConditionResponseDTO
{
    public readonly int $id;
    public readonly int $bingo_game_id;
    public readonly int $object_id;
    public readonly string $object_type;
    public readonly string $connection_type;
    public readonly ?int $bingo_match_id;
    public readonly bool $is_marked;
    public readonly int $pos;
    public readonly string $created_at;
    public readonly string $updated_at;

    public function __construct(
        int $id,
        int $bingo_game_id,
        int $object_id,
        string $object_type,
        string $connection_type,
        ?int $bingo_match_id,
        bool $is_marked,
        int $pos,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->bingo_game_id = $bingo_game_id;
        $this->object_id = $object_id;
        $this->object_type = $object_type;
        $this->connection_type = $connection_type;
        $this->bingo_match_id = $bingo_match_id;
        $this->is_marked = $is_marked;
        $this->pos = $pos;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(BingoCondition $bingoCondition): self
    {
        return new self(
            id: $bingoCondition->id ?? 0,
            bingo_game_id: $bingoCondition->bingo_game_id ?? 0,
            object_id: $bingoCondition->object_id ?? 0,
            object_type: $bingoCondition->object_type ?? '',
            connection_type: $bingoCondition->connection_type ?? '',
            bingo_match_id: $bingoCondition->bingo_match_id ?? null,
            is_marked: (bool)($bingoCondition->is_marked ?? false),
            pos: $bingoCondition->pos ?? 0,
            created_at: $bingoCondition->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $bingoCondition->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'bingo_game_id' => $this->bingo_game_id,
            'object_id' => $this->object_id,
            'object_type' => $this->object_type,
            'connection_type' => $this->connection_type,
            'bingo_match_id' => $this->bingo_match_id,
            'is_marked' => $this->is_marked,
            'pos' => $this->pos,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
