<?php
namespace App\Resources\GamesList\Bingo;

use Illuminate\Http\Resources\Json\JsonResource;

class BingoGuessResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'bingo_game_instance_id' => $this->bingo_game_instance_id,
            'bingo_condition_id' => $this->bingo_condition_id,
            'bingo_match_id' => $this->bingo_match_id,
            'is_correct' => (bool) $this->is_correct,
            'bingo_match' => new BingoMatchResource($this->whenLoaded('match')),
            'next_match' => isset($this->next_match) && $this->next_match ? new BingoMatchResource($this->next_match) : null,
            'remaining_answers' => $this->relationLoaded('gameInstance') ? $this->gameInstance->remaining_answers : null,
            'guessed_at' => $this->created_at?->toIso8601String(),
        ];
    }
}