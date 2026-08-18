<?php

namespace App\Resources\Core;

use Illuminate\Http\Resources\Json\JsonResource;

class SeasonResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'start_year' => $this->start_year,
            'end_year' => $this->end_year,
        ];
    }
}
