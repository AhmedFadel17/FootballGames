<?php
namespace App\Resources\Core;

use Illuminate\Http\Resources\Json\JsonResource;

class PlayerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'fullname' => $this->fullname,
            'position' => $this->position,
            'sub_position' => $this->sub_position,
            'date_of_birth' => $this->date_of_birth,
            'img_src' => $this->img_src,
            'popularity' => $this->popularity,
            'api_id' => $this->api_id,
            'country_id' => $this->country_id,
            'height_cm' => $this->height_cm,
            'weight_kg' => $this->weight_kg,
            'preferred_foot' => $this->preferred_foot,
            'slug' => $this->slug,
            'rating' => $this->rating,
            'market_value' => $this->market_value,
            'is_retired' => $this->is_retired,
            'current_team_id' => $this->current_team_id,
            'country' => new CountryResource($this->whenLoaded('country')),
            'current_team' => new TeamResource($this->whenLoaded('currentTeam')),
            'team_periods' => $this->whenLoaded('teamPeriods'),
            'transfers' => $this->whenLoaded('transfers'),
            'career_season_stats' => $this->whenLoaded('careerSeasonStats'),
            'career_summaries' => $this->whenLoaded('careerSummaries'),
        ];
    }
}
