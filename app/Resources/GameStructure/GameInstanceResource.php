<?php
namespace App\Resources\GameStructure;

use App\Resources\Auth\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class GameInstanceResource extends JsonResource
{
public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'room_code' => $this->room_code,
            'creator_id' => $this->creator_id,
            'description'=> $this->description,
            'status'=>$this->status,
            'max_players' =>$this->max_players ?? 0,
            'creator'=>new UserResource($this->whenLoaded('admin')),
            'entries'=> GameEntryResource::collection($this->whenLoaded('entries')) ?? [],
        ];
    }
}
