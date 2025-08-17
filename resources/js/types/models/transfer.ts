type Transfer = {
    id: number;
    player_id: number;
    from_team_id: number;
    to_team_id: number;
    transfer_date: string;
    player?: {
        id: number;
        name: string;
    };
    from_team?: {
        id: number;
        name: string;
    };
    to_team?: {
        id: number;
        name: string;
    };
}

