<?php
namespace App\Resources\GamesList\Grid;

use Illuminate\Http\Resources\Json\JsonResource;

class GridConditionResource extends JsonResource
{
    public function toArray($request): array
    {
        $objectable = $this->whenLoaded('objectable');

        return [
            'id' => $this->id,
            'grid_game_id' => $this->grid_game_id,
            'object_type' => $this->object_type,
            'object_id' => $this->object_id,
            'object' => $objectable ? [
                'id' => $objectable->id ?? null,
                'name' => $objectable->name ?? null,
                'img_src' => $objectable->img_src ?? $objectable->flag_url ?? null,
            ] : null,
            'type' => $this->type,
            'pos' => $this->pos,
            'connection_type' => $this->connection_type,
        ];
    }
}