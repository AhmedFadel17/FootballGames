<?php

namespace App\Resources\Core;

use Illuminate\Http\Resources\Json\JsonResource;

class CountryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'img_src' => $this->img_src,
            'popularity' => $this->popularity,
            'code' => $this->code,
            'continent_id' => $this->continent_id,
        ];
    }
}
