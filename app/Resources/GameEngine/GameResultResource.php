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
            'duration_seconds' => $this->duration_seconds,
            'earned_xp' => $this->earned_xp,
            'earned_coins' => $this->earned_coins,
            'earned_points' => $this->earned_points,
        ];
    }
}
