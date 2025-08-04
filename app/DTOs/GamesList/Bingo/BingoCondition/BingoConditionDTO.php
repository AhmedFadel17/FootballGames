<?php

namespace App\DTOs\GamesList\Bingo\BingoCondition;

class BingoConditionDTO
{
    public readonly int $bingo_game_id;
    public readonly int $object_id;
    public readonly string $object_type;
    public readonly string $connection_type;
    public readonly ?int $bingo_match_id;
    public readonly bool $is_marked;
    public readonly int $pos;

    public function __construct(array $data)
    {
        $this->bingo_game_id = $data['bingo_game_id'] ?? 0;
        $this->object_id = $data['object_id'] ?? 0;
        $this->object_type = $data['object_type'] ?? '';
        $this->connection_type = $data['connection_type'] ?? '';
        $this->bingo_match_id = $data['bingo_match_id'] ?? null;
        $this->is_marked = isset($data['is_marked']) ? (bool)$data['is_marked'] : false;
        $this->pos = $data['pos'] ?? 0;
    }

    public function toArray(): array
    {
        return [
            'bingo_game_id' => $this->bingo_game_id,
            'object_id' => $this->object_id,
            'object_type' => $this->object_type,
            'connection_type' => $this->connection_type,
            'bingo_match_id' => $this->bingo_match_id,
            'is_marked' => $this->is_marked,
            'pos' => $this->pos,
        ];
    }
}
