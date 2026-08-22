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
            'country' => new CountryResource($this->whenLoaded('country')),
            'team_periods' => $this->whenLoaded('teamPeriods'),
            'transfers' => $this->whenLoaded('transfers'),
            'career_season_stats' => $this->whenLoaded('careerSeasonStats'),
            'career_summaries' => $this->whenLoaded('careerSummaries'),
        ];
    }
}
