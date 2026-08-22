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
            'country' => new CountryResource($this->whenLoaded('country')),
            'team_periods' => $this->whenLoaded('teamPeriods'),
        ];
    }
}
