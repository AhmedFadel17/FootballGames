<?php

namespace App\Resources\Core;

use Illuminate\Http\Resources\Json\JsonResource;

class ContinentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'img_src' => $this->img_src,
            'popularity' => $this->popularity,
        ];
    }
}
