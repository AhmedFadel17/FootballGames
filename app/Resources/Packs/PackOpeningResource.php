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
            'pack' => isset($this->resource['pack']) ? new PackResource($this->resource['pack']) : null,
            'user_coins' => $this->resource['user_coins'] ?? null,
            'coins_spent' => $this->resource['coins_spent'] ?? 0,
            'coins_earned' => $this->resource['coins_earned'] ?? 0,
            'opened_at' => now()->toIso8601String(),
            'items' => collect($this->resource['items'] ?? [])->map(function ($item) {
                return [
                    'item_type' => $item['type'] ?? 'unknown',
                    'amount' => $item['amount'] ?? null,
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