<?php

namespace App\Resources\GameEngine;

use Illuminate\Http\Resources\Json\JsonResource;

class GameResultResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'game_entry_id' => $this->game_entry_id,
            'score' => $this->score,
            'rank' => $this->rank,
            'status' => $this->status,
        ];
    }
}
