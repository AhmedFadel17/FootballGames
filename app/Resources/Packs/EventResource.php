<?php
namespace App\Resources\Packs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'img_src' => $this->img_src,
            'theme_color' => $this->theme_color,
            'is_active' => (bool) $this->is_active,
            'start_date' => $this->start_date?->toIso8601String(),
            'end_date' => $this->end_date?->toIso8601String(),
            'starts_at' => $this->start_date?->toIso8601String(),
            'ends_at' => $this->end_date?->toIso8601String(),
            'packs' => PackResource::collection($this->whenLoaded('packs')),
            'cards_count' => $this->whenCounted('playerCards'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}