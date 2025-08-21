type TeamStat = {
    id: number;
    competition_id: number;
    team_id: number;
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    clean_sheets: number;
    yellow_cards: number;
    red_cards: number;
    penalties_scored: number;
    competition?: Competition;
    team?: Team;
}

