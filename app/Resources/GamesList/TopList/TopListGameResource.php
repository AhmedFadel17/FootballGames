<?php
namespace App\Resources\GamesList\TopList;

use Illuminate\Http\Resources\Json\JsonResource;

class TopListGameResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'items_type' => $this->items_type->value,
            'total_items' => $this->total_items,
            'difficulty' => $this->difficulty,
            'items' => TopListItemResource::collection($this->whenLoaded('items')),
        ];
    }
}