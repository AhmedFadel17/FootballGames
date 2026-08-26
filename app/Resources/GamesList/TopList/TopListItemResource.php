<?php
namespace App\Resources\GamesList\TopList;

use Illuminate\Http\Resources\Json\JsonResource;

class TopListItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'rank' => $this->rank,
            'display_value' => $this->display_value,
            'object' => $this->whenLoaded('object', function () {
                return [
                    'id' => $this->object->id,
                    'name' => $this->object->name ?? $this->object->title,
                    'img_src' => $this->object->image_src ?? $this->object->img_src ?? null,
                ];
            }),
        ];
    }
}