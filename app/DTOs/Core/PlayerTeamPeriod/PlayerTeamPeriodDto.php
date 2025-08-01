<?php

namespace App\DTOs\Core\PlayerTeamPeriod;

class PlayerTeamPeriodDTO
{
    public int $player_id;
    public int $team_id;
    public ?string $start_date;
    public ?string $end_date;

    public function __construct(array $data)
    {
        $this->player_id = $data['player_id'];
        $this->team_id = $data['team_id'];
        $this->start_date = $data['start_date'] ?? null;
        $this->end_date = $data['end_date'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'player_id' => $this->player_id,
            'team_id' => $this->team_id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
        ];
    }
} 