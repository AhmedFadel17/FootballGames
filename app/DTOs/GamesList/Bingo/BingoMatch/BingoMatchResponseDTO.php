<?php

namespace App\DTOs\GamesList\Bingo\BingoMatch;

use App\DTOs\Core\Player\PlayerResponseDTO;
use App\Models\GamesList\Bingo\BingoMatch;

class BingoMatchResponseDTO
{
    public int $id;
    public int $bingo_game_id;
    public ?int $player_id;
    public ?PlayerResponseDTO $player;
    public int $pos;
    public string $created_at;
    public string $updated_at;

    public static function fromModel(BingoMatch $bingoMatch): self
    {
        $dto = new self();

        $dto->id = $bingoMatch->id ?? 0;
        $dto->bingo_game_id = $bingoMatch->bingo_game_id ?? 0;
        $dto->player_id = $bingoMatch->player_id ?? null;

        $dto->player = $bingoMatch->relationLoaded('player') && $bingoMatch->player
            ? new PlayerResponseDTO($bingoMatch->player)
            : null;

        $dto->pos = $bingoMatch->pos ?? 0;
        $dto->created_at = $bingoMatch->created_at?->format('Y-m-d H:i:s') ?? '';
        $dto->updated_at = $bingoMatch->updated_at?->format('Y-m-d H:i:s') ?? '';

        return $dto;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'bingo_game_id' => $this->bingo_game_id,
            'player_id' => $this->player_id,
            'player' => $this->player?->toArray(),
            'pos' => $this->pos,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
