<?php

namespace App\Resources\GameEngine;

use App\Resources\Auth\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class GameEntryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'game_instance_id' => $this->game_instance_id,
            'data' => $this->data,
        ];
    }
}
