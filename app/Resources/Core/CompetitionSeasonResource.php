<?php

namespace App\Resources\Core;

use Illuminate\Http\Resources\Json\JsonResource;

class CompetitionSeasonResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'competition_id' => $this->competition_id,
            'season_id' => $this->season_id,
            'winner_team_id' => $this->winner_team_id,
            'competition' => new CompetitionResource($this->whenLoaded('competition')),
            'season' => new SeasonResource($this->whenLoaded('season')),
            'winner_team' => new TeamResource($this->whenLoaded('winnerTeam')),
        ];
    }
}
