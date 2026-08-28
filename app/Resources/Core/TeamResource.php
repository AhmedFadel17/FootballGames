<?php

namespace App\Resources\Core;

use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'abbr' => $this->abbr,
            'img_src' => $this->img_src,
            'popularity' => $this->popularity,
            'api_id' => $this->api_id,
            'country_id' => $this->country_id,
            'type' => $this->type,
            'current_competition_id' => $this->current_competition_id,
            'titles_won' => $this->when(isset($this->titles_won), (int) $this->titles_won),
            'country' => new CountryResource($this->whenLoaded('country')),
            'current_competition' => new CompetitionResource($this->whenLoaded('currentCompetition')),
            'current_squad' => PlayerResource::collection($this->whenLoaded('currentSquad')),
            'current_manager' => new ManagerResource($this->whenLoaded('currentManager')),
            'honors' => CompetitionSeasonResource::collection($this->whenLoaded('wonCompetitionSeasons')),
            'standings' => StandingResource::collection($this->whenLoaded('standings')),
            'manager_periods' => $this->whenLoaded('managerPeriods'),
        ];
    }
}


