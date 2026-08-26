<?php

namespace App\Resources\Core;

use Illuminate\Http\Resources\Json\JsonResource;

class ManagerResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'api_id' => $this->api_id,
            'country_id' => $this->country_id,
            'popularity' => $this->popularity,
            'img_src' => $this->img_src,
            'is_retired' => $this->is_retired,
            'current_team_id' => $this->current_team_id,
            'country' => new CountryResource($this->whenLoaded('country')),
            'current_team' => new TeamResource($this->whenLoaded('currentTeam')),
            'team_periods' => $this->whenLoaded('teamPeriods'),
        ];
    }
}
