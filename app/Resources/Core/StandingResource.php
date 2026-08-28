<?php

namespace App\Resources\Core;

use Illuminate\Http\Resources\Json\JsonResource;

class StandingResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'competition_season_id' => $this->competition_season_id,
            'team_id' => $this->team_id,
            'position' => $this->position,
            'played' => $this->played,
            'won' => $this->won,
            'drawn' => $this->drawn,
            'lost' => $this->lost,
            'goals_for' => $this->goals_for,
            'goals_against' => $this->goals_against,
            'goal_difference' => $this->goal_difference,
            'points' => $this->points,
            'team' => new TeamResource($this->whenLoaded('team')),
            'competition_season' => new CompetitionSeasonResource($this->whenLoaded('competitionSeason')),
        ];
    }
}
