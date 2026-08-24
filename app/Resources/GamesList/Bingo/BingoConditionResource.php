<?php
namespace App\Resources\GamesList\Bingo;

use Illuminate\Http\Resources\Json\JsonResource;

class BingoConditionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'bingo_game_id' => $this->bingo_game_id,
            'object_type' => $this->object_type,
            'object_id' => $this->object_id,
            'object' => $this->whenLoaded('objectable'),
            'is_marked' => $this->is_marked,
            'pos' => $this->pos,
            'match' => new BingoMatchResource($this->whenLoaded('match')),
        ];
    }
}