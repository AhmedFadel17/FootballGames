<?php
namespace App\Resources\GamesList\Grid;

use Illuminate\Http\Resources\Json\JsonResource;

class GridGameResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'size' => $this->size,
            'difficulty' => $this->difficulty,
            'conditions' => GridConditionResource::collection($this->whenLoaded('conditions')),
        ];
    }
}