<?php
namespace App\Resources\GameStructure;

use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description'=> $this->description,
            'is_active'=>$this->is_active,
            'min_players' =>$this->min_players ?? 0,
            'max_players' =>$this->max_players ?? 0,
        ];
    }
}