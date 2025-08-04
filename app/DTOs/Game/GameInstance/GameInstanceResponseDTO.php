<?php

namespace App\DTOs\Game\GameInstance;

use App\Models\Game\GameInstance;

class GameInstanceResponseDTO
{
    public readonly int $id;
    public readonly int $game_id;
    public readonly string $start_at;
    public readonly ?string $end_at;
    public readonly string $status;
    public readonly string $created_at;
    public readonly string $updated_at;

    public function __construct(
        int $id,
        int $game_id,
        string $start_at,
        ?string $end_at,
        string $status,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->game_id = $game_id;
        $this->start_at = $start_at;
        $this->end_at = $end_at;
        $this->status = $status;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(GameInstance $gameInstance): self
    {
        return new self(
            id: $gameInstance->id ?? 0,
            game_id: $gameInstance->game_id ?? 0,
            start_at: $gameInstance->start_at?->format('Y-m-d H:i:s') ?? '',
            end_at: $gameInstance->end_at?->format('Y-m-d H:i:s') ?? null,
            status: $gameInstance->status ?? '',
            created_at: $gameInstance->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $gameInstance->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'game_id' => $this->game_id,
            'start_at' => $this->start_at,
            'end_at' => $this->end_at,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
