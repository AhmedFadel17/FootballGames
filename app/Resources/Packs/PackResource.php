<?php
namespace App\Resources\Packs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackResource extends JsonResource
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
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'img_src' => $this->img_src,
            'price_coins' => (int) $this->price_coins,
            'cards_count' => (int) $this->cards_count,
            'required_level' => (int) $this->required_level,
            'user_limit' => $this->user_limit !== null ? (int) $this->user_limit : null,
            'limit_type' => $this->limit_type?->value ?? $this->limit_type,
            'is_active' => (bool) $this->is_active,
            'event' => new EventResource($this->whenLoaded('event')),
            'drop_rules' => PackDropRuleResource::collection($this->whenLoaded('dropRules')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}