<?php

namespace App\DTOs\Game\GameEntry;

use App\Models\Game\GameEntry;

class GameEntryResponseDTO
{
    public readonly int $id;
    public readonly int $user_id;
    public readonly int $game_instance_id;
    public readonly ?string $data;
    public readonly string $created_at;
    public readonly string $updated_at;

    public function __construct(
        int $id,
        int $user_id,
        int $game_instance_id,
        ?string $data,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->game_instance_id = $game_instance_id;
        $this->data = $data;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(GameEntry $gameEntry): self
    {
        return new self(
            id: $gameEntry->id ?? 0,
            user_id: $gameEntry->user_id ?? 0,
            game_instance_id: $gameEntry->game_instance_id ?? 0,
            data: $gameEntry->data ?? null,
            created_at: $gameEntry->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $gameEntry->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'game_instance_id' => $this->game_instance_id,
            'data' => $this->data,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
