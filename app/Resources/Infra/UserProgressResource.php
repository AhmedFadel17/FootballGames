<?php
namespace App\Resources\Infra;

use Illuminate\Http\Resources\Json\JsonResource;

class UserProgressResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'coins' => $this->coins,
            'points' => $this->points,
            'xp' => $this->xp,
            'next_level_xp' => $this->next_level_xp ?? $this->xp,
            'level' => $this->level,
            'stamina' => $this->stamina,
            'max_stamina' => $this->max_stamina,
            'last_stamina_update' => $this->last_stamina_update,
        ];
    }
}