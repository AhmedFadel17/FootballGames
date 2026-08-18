<?php

namespace App\Resources\Core;

use Illuminate\Http\Resources\Json\JsonResource;

class CompetitionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'abbr' => $this->abbr,
            'country_id' => $this->country_id,
            'type' => $this->type,
            'founded_year' => $this->founded_year,
            'tier' => $this->tier,
            'img_src' => $this->img_src,
            'popularity' => $this->popularity,
            'is_active' => $this->is_active,
            'slug' => $this->slug,
            'api_id' => $this->api_id,
            'country' => new CountryResource($this->whenLoaded('country')),
        ];
    }
}
