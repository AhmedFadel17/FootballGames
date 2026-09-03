<?php
namespace App\Resources\GamesList\Bingo;

use Illuminate\Http\Resources\Json\JsonResource;

class BingoGameInstanceResource extends JsonResource
{
    public function toArray($request): array
    {
        $conditions = $this->relationLoaded('conditions')
            ? $this->conditions
            : ($this->relationLoaded('bingoGame') && $this->bingoGame->relationLoaded('conditions')
                ? $this->bingoGame->conditions
                : collect());

        $currentMatch = null;
        if ($this->relationLoaded('bingoGame') && $this->bingoGame->relationLoaded('matches')) {
            $currentMatch = $this->bingoGame->matches->firstWhere('pos', $this->current_match_pos);
        }

        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'bingo_game_id' => $this->bingo_game_id,
            'bingo_game' => new BingoGameResource($this->whenLoaded('bingoGame')),
            'size' => $this->bingoGame?->size,
            'remaining_answers' => $this->remaining_answers,
            'current_match_pos' => $this->current_match_pos,
            'difficulty' => $this->bingoGame?->difficulty,
            'conditions' => BingoConditionResource::collection($conditions),
            'current_match' => $currentMatch ? new BingoMatchResource($currentMatch) : null,
            'guesses' => BingoGuessResource::collection($this->whenLoaded('guesses')),
        ];
    }
}