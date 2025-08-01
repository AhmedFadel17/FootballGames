<?php

namespace App\DTOs\Core\ManagerTeamPeriod;

use App\Models\Core\ManagerTeamPeriod;

class ManagerTeamPeriodResponseDTO
{
    public int $id;
    public int $manager_id;
    public int $team_id;
    public ?string $start_date;
    public ?string $end_date;

    public function __construct(ManagerTeamPeriod $period)
    {
        $this->id = $period->id;
        $this->manager_id = $period->manager_id;
        $this->team_id = $period->team_id;
        $this->start_date = $period->start_date;
        $this->end_date = $period->end_date;
    }
} 