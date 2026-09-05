<?php
namespace App\Resources\Packs;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CosmeticResource extends JsonResource
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
            'type' => $this->type,
            'rarity' => $this->rarity,
            'description' => $this->description,
            'img_src' => $this->img_src,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}