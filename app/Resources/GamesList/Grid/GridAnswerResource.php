<?php
namespace App\Resources\GamesList\Grid;

use App\Resources\Core\PlayerResource;
use Illuminate\Http\Resources\Json\JsonResource;

class GridAnswerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'grid_game_id' => $this->grid_game_id,
            'game_entry_id' => $this->game_entry_id,
            'player_id' => $this->player_id,
            'row_index' => $this->row_index,
            'column_index' => $this->column_index,
            'is_correct' => $this->is_correct,
            'rarity_score' => $this->rarity_score,
            'player' => new PlayerResource($this->whenLoaded('player')),
        ];
    }
}