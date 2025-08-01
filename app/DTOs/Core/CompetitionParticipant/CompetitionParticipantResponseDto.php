<?php

namespace App\DTOs\Core\CompetitionParticipant;

use App\Models\Core\CompetitionParticipant;

class CompetitionParticipantResponseDTO
{
    public int $id;
    public int $competition_id;
    public int $season_id;
    public int $team_id;
    public bool $is_winner;

    public function __construct(CompetitionParticipant $participant)
    {
        $this->id = $participant->id;
        $this->competition_id = $participant->competition_id;
        $this->season_id = $participant->season_id;
        $this->team_id = $participant->team_id;
        $this->is_winner = $participant->is_winner;
    }
} 