<?php
namespace App\Resources\GameEngine;

use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'img_src' => $this->img_src,
            'is_active' => $this->is_active,
            'min_players' => $this->min_players ?? 0,
            'max_players' => $this->max_players ?? 0,
            'stamina_cost' => $this->stamina_cost,
            'base_xp' => $this->base_xp,
            'base_coins' => $this->base_coins,
            'base_points' => $this->base_points,
            'time_limit_seconds' => $this->time_limit_seconds,
        ];
    }
}