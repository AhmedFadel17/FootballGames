<?php

namespace App\Resources\GamesList;

use App\Resources\GameStructure\GameInstanceResource;
use Illuminate\Http\Resources\Json\JsonResource;

class GuessThePlayerRescource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'game_instance' => new GameInstanceResource($this->whenLoaded('instance')),
            'players_count' => $this->players_count,
            'assignments'=>GuessThePlayerAssignmentRescource::collection($this->whenLoaded('assignments')) ?? [],
        ];
    }
}
