<?php
namespace App\Resources\Packs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackDropRuleResource extends JsonResource
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
            'pack_id' => $this->pack_id,
            'drop_type' => $this->drop_type,
            'item_type' => $this->drop_type,
            'rarity' => $this->rarity?->value ?? $this->rarity,
            'event_id' => $this->event_id,
            'min_coins' => (int) $this->min_coins,
            'max_coins' => (int) $this->max_coins,
            'drop_percentage' => (float) $this->drop_percentage,
            'drop_chance' => (float) $this->drop_percentage,
            'pack' => new PackResource($this->whenLoaded('pack')),
            'event' => new EventResource($this->whenLoaded('event')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}