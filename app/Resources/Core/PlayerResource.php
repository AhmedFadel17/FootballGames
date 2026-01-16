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
            'country' => new CountryResource($this->whenLoaded('country')),
        ];
    }
}