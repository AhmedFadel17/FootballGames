<?php

namespace App\DTOs\GamesList\TopList;

use App\Models\GamesList\TopList\TopListItem;

class TopListItemResponseDTO
{
    public readonly int $id;
    public readonly int $top_list_game_id;
    public readonly string $object_id;
    public readonly int $pos;
    public readonly array $object;
    public readonly string $created_at;
    public readonly string $updated_at;
    public function __construct(
        int $id,
        int $top_list_game_id,
        string $object_id,
        int $pos,
        string $created_at,
        string $updated_at,
        array $object,
    ) {
        $this->id = $id;
        $this->top_list_game_id = $top_list_game_id;
        $this->object_id = $object_id;
        $this->pos = $pos;
        $this->object = $object;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(TopListItem $game): self
    {
        return new self(
            id: $game->id ?? 0,
            top_list_game_id: $game->top_list_game_id ?? 0,
            object_id: $game->object_id ?? null,
            pos: $game->pos ?? 0,
            object: [
                "id" => $game->object->id,
                "name" => $game->object->name,
                "img_src" => $game->object->img_src
            ],
            created_at: $game->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $game->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }


    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'top_list_game_id' => $this->top_list_game_id,
            'object_id' => $this->object_id,
            'pos' => $this->pos,
            'object' => $this->object,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
