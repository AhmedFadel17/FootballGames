<?php

namespace App\DTOs\GamesList\Bingo\BingoCondition;

use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchResponseDTO;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Shared\Enums\BingoConnectionType;

class BingoConditionResponseDTO
{
    public int $id;
    public int $bingo_game_id;
    public int $object_id;
    public ?object $object;
    public string $object_type;
    public ?BingoMatchResponseDTO $match;
    public BingoConnectionType $connection_type;
    public ?int $bingo_match_id;
    public bool $is_marked;
    public int $pos;
    public string $created_at;
    public string $updated_at;

    public static function fromModel(BingoCondition $bingoCondition): self
    {
        $dto = new self();

        $dto->id = $bingoCondition->id ?? 0;
        $dto->bingo_game_id = $bingoCondition->bingo_game_id ?? 0;
        $dto->object_id = $bingoCondition->object_id ?? 0;
        $dto->object = $bingoCondition->objectable;
        $dto->object_type = $bingoCondition->object_type ?? '';
        $dto->match = $bingoCondition->match ? BingoMatchResponseDTO::fromModel($bingoCondition->match) : null;
        $dto->connection_type = $bingoCondition->connection_type;
        $dto->bingo_match_id = $bingoCondition->bingo_match_id;
        $dto->is_marked = (bool)($bingoCondition->is_marked ?? false);
        $dto->pos = $bingoCondition->pos ?? 0;
        $dto->created_at = $bingoCondition->created_at?->format('Y-m-d H:i:s') ?? '';
        $dto->updated_at = $bingoCondition->updated_at?->format('Y-m-d H:i:s') ?? '';

        return $dto;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'bingo_game_id' => $this->bingo_game_id,
            'object_id' => $this->object_id,
            'object' => $this->object ? $this->object->toArray() : null,
            'object_type' => $this->object_type,
            'match' => $this->match?->toArray(),
            'connection_type' => $this->connection_type->value ?? null,
            'bingo_match_id' => $this->bingo_match_id,
            'is_marked' => $this->is_marked,
            'pos' => $this->pos,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
