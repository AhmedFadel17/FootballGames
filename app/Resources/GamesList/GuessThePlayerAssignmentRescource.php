<?php

namespace App\Resources\GamesList;

use App\Resources\Core\PlayerResource;
use App\Resources\GameStructure\GameEntryResource;
use App\Resources\GameStructure\GameInstanceResource;
use Illuminate\Http\Resources\Json\JsonResource;

class GuessThePlayerAssignmentRescource extends JsonResource
{
    public function toArray($request): array
    {
        $authUserId = $request->user()?->id;
        $canSeePlayer = ($this->entry && $this->entry->user_id === $authUserId) || $this->is_solved;
        $isMe = $this->entry && $this->entry->user_id === $authUserId;
        return [
            'id' => $this->id,
            'guess_the_player_game_id' => $this->target_player_id,
            'game_entry_id' => $this->game_entry_id,
            'entry' => new GameEntryResource($this->whenLoaded('entry')),
            'target_player_id' => $canSeePlayer ? $this->target_player_id : null,
            'player' => $this->when($canSeePlayer, function () {
                return new PlayerResource($this->whenLoaded('player'));
            }),
            'is_me' => $isMe,
            'is_solved' => (bool) $this->is_solved,
            'solved_at' => $this->solved_at,
        ];
    }
}
