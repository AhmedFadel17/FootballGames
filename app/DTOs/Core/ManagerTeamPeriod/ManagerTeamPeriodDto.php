<?php

namespace App\DTOs\Core\ManagerTeamPeriod;

class ManagerTeamPeriodDTO
{
    public int $manager_id;
    public int $team_id;
    public ?string $start_date;
    public ?string $end_date;

    public function __construct(array $data)
    {
        $this->manager_id = $data['manager_id'];
        $this->team_id = $data['team_id'];
        $this->start_date = $data['start_date'] ?? null;
        $this->end_date = $data['end_date'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'manager_id' => $this->manager_id,
            'team_id' => $this->team_id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
        ];
    }
} 