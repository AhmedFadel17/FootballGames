type Game = {
    id: number;
    name: string;
    slug:string;
    description: string;
    min_players:number;
    max_players:number;
    is_active: boolean;
}

type GameResult = {
    id: number;
    game_entry_id: number;
    score: number;
    rank: number;
    status: "won" | "lost" | "playing";
}
