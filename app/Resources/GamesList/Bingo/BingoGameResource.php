<?php
namespace App\Resources\GamesList\Bingo;

use Illuminate\Http\Resources\Json\JsonResource;

class BingoGameResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'size' => $this->size,
            'remaining_answers' => $this->remaining_answers,
            'difficulty' => $this->difficulty,
            'conditions' => BingoConditionResource::collection($this->whenLoaded('conditions')),
        ];
    }
}