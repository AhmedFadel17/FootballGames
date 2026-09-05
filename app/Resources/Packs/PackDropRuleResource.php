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
            'item_type' => $this->item_type,
            'min_rating' => $this->min_rating !== null ? (int) $this->min_rating : null,
            'max_rating' => $this->max_rating !== null ? (int) $this->max_rating : null,
            'drop_chance' => (float) $this->drop_chance,
            'pack' => new PackResource($this->whenLoaded('pack')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}