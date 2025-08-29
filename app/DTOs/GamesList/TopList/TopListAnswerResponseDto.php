<?php

namespace App\DTOs\GamesList\TopList;

use App\Models\GamesList\TopList\TopListAnswer;
use App\Models\GamesList\TopList\TopListItem;

class TopListAnswerResponseDTO
{
    public readonly int $id;
    public readonly ?int $top_list_item_id;
    public readonly int $game_entry_id;
    public readonly ?TopListItemResponseDTO $item;
    public function __construct(
        int $id,
        ?int $top_list_item_id,
        int $game_entry_id,
        ?TopListItemResponseDTO $item
    ) {
        $this->id = $id;
        $this->top_list_item_id = $top_list_item_id;
        $this->game_entry_id = $game_entry_id;
        $this->item = $item;
    }

    public static function fromModel(TopListAnswer $game): self
    {
        return new self(
            id: $game->id ?? 0,
            top_list_item_id: $game->top_list_item_id ?? null,
            game_entry_id: $game->game_entry_id ?? null,
            item: $game->item ? TopListItemResponseDTO::fromModel($game->item) : null
        );
    }


    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'top_list_item_id' => $this->top_list_item_id,
            'game_entry_id' => $this->game_entry_id,
            'item' => $this->item,
        ];
    }
}
