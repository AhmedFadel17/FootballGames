<?php
namespace App\Resources\GamesList\Career;

use App\Enums\Core\TeamType;
use App\Resources\Core\PlayerResource;
use App\Resources\Core\TeamResource;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class CareerGameResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'total_steps' => $this->total_steps,
            'difficulty' => $this->difficulty,
            'player' => $this->whenLoaded('player', new PlayerResource($this->player)),
        ];
    }
}