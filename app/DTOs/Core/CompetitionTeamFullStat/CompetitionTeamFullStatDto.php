<?php

namespace App\DTOs\Core\CompetitionTeamFullStat;

class CompetitionTeamFullStatDTO
{
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

    public function __construct(array $data)
    {
        $this->competition_id = $data['competition_id'];
        $this->team_id = $data['team_id'];
        $this->matches_played = $data['matches_played'] ?? null;
        $this->wins = $data['wins'] ?? null;
        $this->draws = $data['draws'] ?? null;
        $this->losses = $data['losses'] ?? null;
        $this->goals_for = $data['goals_for'] ?? null;
        $this->goals_against = $data['goals_against'] ?? null;
        $this->clean_sheets = $data['clean_sheets'] ?? null;
        $this->yellow_cards = $data['yellow_cards'] ?? null;
        $this->red_cards = $data['red_cards'] ?? null;
        $this->penalties_scored = $data['penalties_scored'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'competition_id' => $this->competition_id,
            'team_id' => $this->team_id,
            'matches_played' => $this->matches_played,
            'wins' => $this->wins,
            'draws' => $this->draws,
            'losses' => $this->losses,
            'goals_for' => $this->goals_for,
            'goals_against' => $this->goals_against,
            'clean_sheets' => $this->clean_sheets,
            'yellow_cards' => $this->yellow_cards,
            'red_cards' => $this->red_cards,
            'penalties_scored' => $this->penalties_scored,
        ];
    }
} 