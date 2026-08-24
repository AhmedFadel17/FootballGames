<?php

namespace App\Resources\GameEngine;

use Illuminate\Http\Resources\Json\JsonResource;

class GamePrizeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'rank' => $this->rank,
            'reward' => $this->reward,
        ];
    }
}
