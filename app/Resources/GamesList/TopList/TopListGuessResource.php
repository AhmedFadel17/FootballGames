<?php
namespace App\Resources\GamesList\TopList;

use App\Resources\Core\PlayerResource;
use Illuminate\Http\Resources\Json\JsonResource;

class TopListGuessResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'object_id' => $this->object_id,
            'object_type' => $this->object_type->value,
            'is_correct' => $this->is_correct,
            'matched_rank' => $this->matched_rank,
            'object' => $this->whenLoaded('object', function () {
                return [
                    'id' => $this->object->id,
                    'name' => $this->object->name ?? $this->object->title,
                    'img_src' => $this->object->image_src ?? $this->object->img_src ?? null,
                ];
            }),
            'guessed_at' => $this->created_at?->toIso8601String(),
        ];
    }
}