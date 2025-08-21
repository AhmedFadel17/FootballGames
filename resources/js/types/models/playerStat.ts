type PlayerStat = {
    id: number;
    competition_id: number;
    player_id: number;
    appearances: number;
    minutes_played: number;
    goals: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    clean_sheets: number;
    saves: number;
    penalties_saved: number;
    own_goals: number;
    goals_conceded: number;
    competition?: Competition;
    player?: Player;
}

