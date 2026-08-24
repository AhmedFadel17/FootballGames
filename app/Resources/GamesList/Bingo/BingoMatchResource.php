<?php
namespace App\Resources\GamesList\Bingo;

use App\Resources\Core\PlayerResource;
use Illuminate\Http\Resources\Json\JsonResource;

class BingoMatchResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'bingo_game_id' => $this->bingo_game_id,
            'player_id' => $this->player_id,
            'pos' => $this->pos,
            'player' => new PlayerResource($this->whenLoaded('player')),
        ];
    }
}