<?php
namespace App\Resources\Packs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackOpeningResource extends JsonResource
{
    /**
     * Transform the resource array into a structured pack opening payload.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'pack_id' => $this->resource['pack_id'] ?? null,
            'opened_at' => now()->toIso8601String(),
            'items' => collect($this->resource['items'] ?? [])->map(function ($item) {
                return [
                    'item_type' => $item['type'] ?? 'unknown',
                    'data' => match ($item['type'] ?? null) {
                        'player_card' => new PlayerCardResource($item['model']),
                        'powerup' => new PowerupResource($item['model']),
                        'cosmetic' => new CosmeticResource($item['model']),
                        default => $item['model'] ?? null,
                    },
                ];
            }),
        ];
    }
}