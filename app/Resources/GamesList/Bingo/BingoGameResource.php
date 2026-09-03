<?php
namespace App\Resources\GamesList\Bingo;

use Illuminate\Http\Resources\Json\JsonResource;

class BingoGameResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'size' => $this->size,
            'total_answers' => $this->total_answers,
            'difficulty' => $this->difficulty,
            'conditions' => BingoConditionResource::collection($this->whenLoaded('conditions')),
        ];
    }
}