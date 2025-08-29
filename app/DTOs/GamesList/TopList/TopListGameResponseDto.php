<?php

namespace App\DTOs\GamesList\TopList;

use App\DTOs\Gameslist\TopList;
use App\Models\GamesList\TopList\TopListAnswer;
use App\Models\GamesList\TopList\TopListGame;
use App\Shared\Enums\TopListItemstype;

class TopListGameResponseDTO
{
    public readonly int $id;
    public readonly int $game_id;
    public readonly string $title;
    public readonly string $type;
    public readonly int $size;
    public readonly int $max_chances;
    public readonly int $game_instance_id;
    public readonly string $created_at;
    public readonly string $updated_at;
    public readonly array $answers;
    public function __construct(
        int $id,
        int $game_id,
        string $title,
        string $type,
        int $size,
        int $max_chances,
        int $game_instance_id,
        array $answers,
        string $created_at,
        string $updated_at
    ) {
        $this->id = $id;
        $this->game_id = $game_id;
        $this->title = $title;
        $this->type = $type;
        $this->size = $size;
        $this->max_chances = $max_chances;
        $this->answers = $answers;
        $this->game_instance_id=$game_instance_id;
        $this->created_at = $created_at;
        $this->updated_at = $updated_at;
    }

    public static function fromModel(TopListGame $game, array $answers = [],int $instanceId): self
    {
        return new self(
            id: $game->id ?? 0,
            game_id: $game->game_id ?? 0,
            title: $game->title ?? '',
            type: $game->items_type ?? '',
            size: $game->size ?? 0,
            max_chances: $game->max_chances ?? 0,
            answers: $answers,
            game_instance_id:$instanceId,
            created_at: $game->created_at?->format('Y-m-d H:i:s') ?? '',
            updated_at: $game->updated_at?->format('Y-m-d H:i:s') ?? ''
        );
    }


    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'game_id' => $this->game_id,
            'title' => $this->title,
            'type' => $this->type,
            'size' => $this->size,
            'max_chances' => $this->max_chances,
            'answers' => $this->answers,
            'game_instance_id' => $this->game_instance_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
