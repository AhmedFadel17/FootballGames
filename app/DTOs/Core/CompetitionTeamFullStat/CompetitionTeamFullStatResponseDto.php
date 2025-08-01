<?php

namespace App\DTOs\Core\CompetitionTeamFullStat;

use App\Models\Core\CompetitionTeamFullStat;

class CompetitionTeamFullStatResponseDTO
{
    public int $id;
    public int $competition_id;
    public int $team_id;
    public ?int $matches_played;
    public ?int $wins;
    public ?int $draws;
    public ?int $losses;
    public ?int $goals_for;
    public ?int $goals_against;
    public ?int $clean_sheets;
    public ?int $yellow_cards;
    public ?int $red_cards;
    public ?int $penalties_scored;

    public function __construct(CompetitionTeamFullStat $stat)
    {
        $this->id = $stat->id;
        $this->competition_id = $stat->competition_id;
        $this->team_id = $stat->team_id;
        $this->matches_played = $stat->matches_played;
        $this->wins = $stat->wins;
        $this->draws = $stat->draws;
        $this->losses = $stat->losses;
        $this->goals_for = $stat->goals_for;
        $this->goals_against = $stat->goals_against;
        $this->clean_sheets = $stat->clean_sheets;
        $this->yellow_cards = $stat->yellow_cards;
        $this->red_cards = $stat->red_cards;
        $this->penalties_scored = $stat->penalties_scored;
    }
} 