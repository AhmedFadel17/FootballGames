<?php

namespace App\DTOs\Core\CompetitionPlayerFullStat;

class CompetitionPlayerFullStatDTO
{
    public int $competition_id;
    public int $player_id;
    public ?int $appearances;
    public ?int $minutes_played;
    public ?int $goals;
    public ?int $assists;
    public ?int $yellow_cards;
    public ?int $red_cards;
    public ?int $clean_sheets;
    public ?int $saves;
    public ?int $penalties_saved;
    public ?int $own_goals;
    public ?int $goals_conceded;

    public function __construct(array $data)
    {
        $this->competition_id = $data['competition_id'];
        $this->player_id = $data['player_id'];
        $this->appearances = $data['appearances'] ?? null;
        $this->minutes_played = $data['minutes_played'] ?? null;
        $this->goals = $data['goals'] ?? null;
        $this->assists = $data['assists'] ?? null;
        $this->yellow_cards = $data['yellow_cards'] ?? null;
        $this->red_cards = $data['red_cards'] ?? null;
        $this->clean_sheets = $data['clean_sheets'] ?? null;
        $this->saves = $data['saves'] ?? null;
        $this->penalties_saved = $data['penalties_saved'] ?? null;
        $this->own_goals = $data['own_goals'] ?? null;
        $this->goals_conceded = $data['goals_conceded'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'competition_id' => $this->competition_id,
            'player_id' => $this->player_id,
            'appearances' => $this->appearances,
            'minutes_played' => $this->minutes_played,
            'goals' => $this->goals,
            'assists' => $this->assists,
            'yellow_cards' => $this->yellow_cards,
            'red_cards' => $this->red_cards,
            'clean_sheets' => $this->clean_sheets,
            'saves' => $this->saves,
            'penalties_saved' => $this->penalties_saved,
            'own_goals' => $this->own_goals,
            'goals_conceded' => $this->goals_conceded,
        ];
    }
} 