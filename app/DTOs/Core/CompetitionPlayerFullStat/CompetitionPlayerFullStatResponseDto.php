<?php

namespace App\DTOs\Core\CompetitionPlayerFullStat;

use App\DTOs\Core\Competition\CompetitionResponseDTO;
use App\DTOs\Core\Player\PlayerResponseDTO;
use App\Models\Core\CompetitionPlayerFullStat;

class CompetitionPlayerFullStatResponseDTO
{
    public int $id;
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
    public ?PlayerResponseDTO $player;
    public ?CompetitionResponseDTO $competition;

    public function __construct(CompetitionPlayerFullStat $stat)
    {
        $this->id = $stat->id;
        $this->competition_id = $stat->competition_id;
        $this->player_id = $stat->player_id;
        $this->appearances = $stat->appearances;
        $this->minutes_played = $stat->minutes_played;
        $this->goals = $stat->goals;
        $this->assists = $stat->assists;
        $this->yellow_cards = $stat->yellow_cards;
        $this->red_cards = $stat->red_cards;
        $this->clean_sheets = $stat->clean_sheets;
        $this->saves = $stat->saves;
        $this->penalties_saved = $stat->penalties_saved;
        $this->own_goals = $stat->own_goals;
        $this->goals_conceded = $stat->goals_conceded;
        $this->player = $stat->player ? new PlayerResponseDTO($stat->player) : null;
        $this->competition = $stat->competition ? new CompetitionResponseDTO($stat->competition) : null;

    }
}
