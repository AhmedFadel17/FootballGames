<?php
namespace App\Resources\GamesList\Career;

use App\Enums\Core\TeamType;
use App\Resources\Core\TeamResource;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class CareerGameResource extends JsonResource
{
    public function toArray($request): array
    {
        $allPeriods = $this->player->teamPeriods()
            ->whereHas('team', fn($query) => $query->where('type', TeamType::CLUB))
            ->orderBy('start_date', 'asc')
            ->get();

        $steps = $allPeriods->map(function ($period, $index) {
            $isRevealed = ($index < $this->revealed_steps);

            return [
                'step_number' => $index + 1,
                'is_revealed' => $isRevealed,
                'team' => $isRevealed ? new TeamResource($period->team) : null,
                'start_year' => $isRevealed && $period->start_date ? Carbon::parse($period->start_date)->format('Y') : null,
                'end_year' => $isRevealed && $period->end_date ? Carbon::parse($period->end_date)->format('Y') : null,
            ];
        });

        return [
            'id' => $this->id,
            'game_instance_id' => $this->game_instance_id,
            'total_steps' => $this->total_steps,
            'revealed_steps' => $this->revealed_steps,
            'attempts_left' => $this->attempts_left,
            'difficulty' => $this->difficulty,
            'steps' => $steps,
        ];
    }
}