<?php
namespace App\Resources\Packs;

use App\Resources\Core\PlayerResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerCardResource extends JsonResource
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
            'player_id' => $this->player_id,
            'event_id' => $this->event_id,
            'rating' => (int) $this->rating,
            'rarity' => $this->rarity,
            'position' => $this->position,
            'img_src' => $this->img_src,
            'stats' => $this->stats ?? [],
            'player' => new PlayerResource($this->whenLoaded('player')),
            'event' => new EventResource($this->whenLoaded('event')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}