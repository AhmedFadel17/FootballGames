<?php
namespace App\Resources\GamesList\TopList;

use Illuminate\Http\Resources\Json\JsonResource;

class TopListGameInstanceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'question' => new TopListGameResource($this->whenLoaded('masterQuestion')),
            'max_attempts' => $this->max_attempts,
            'guesses' => TopListGuessResource::collection($this->whenLoaded('guesses')),

        ];
    }
}