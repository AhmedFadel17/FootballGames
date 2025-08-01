<?php

namespace App\DTOs\Core\PlayerTeamPeriod;

use App\Models\Core\PlayerTeamPeriod;

class PlayerTeamPeriodResponseDTO
{
    public int $id;
    public int $player_id;
    public int $team_id;
    public ?string $start_date;
    public ?string $end_date;

    public function __construct(PlayerTeamPeriod $period)
    {
        $this->id = $period->id;
        $this->player_id = $period->player_id;
        $this->team_id = $period->team_id;
        $this->start_date = $period->start_date;
        $this->end_date = $period->end_date;
    }
} 