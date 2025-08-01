<?php

namespace App\DTOs\Core\CompetitionParticipant;

class CompetitionParticipantDTO
{
    public int $competition_id;
    public int $season_id;
    public int $team_id;
    public bool $is_winner;

    public function __construct(array $data)
    {
        $this->competition_id = $data['competition_id'];
        $this->season_id = $data['season_id'];
        $this->team_id = $data['team_id'];
        $this->is_winner = $data['is_winner'] ?? false;
    }

    public function toArray(): array
    {
        return [
            'competition_id' => $this->competition_id,
            'season_id' => $this->season_id,
            'team_id' => $this->team_id,
            'is_winner' => $this->is_winner,
        ];
    }
} 