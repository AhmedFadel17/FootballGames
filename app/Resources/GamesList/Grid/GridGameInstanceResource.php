<?php
namespace App\Resources\GamesList\Grid;

use Illuminate\Http\Resources\Json\JsonResource;

class GridGameInstanceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'max_attempts' => $this->max_attempts,
            'grid_game' => GridGameResource::make($this->whenLoaded('gridGame')),
            'answers' => GridAnswerResource::collection($this->whenLoaded('answers')),
        ];
    }
}