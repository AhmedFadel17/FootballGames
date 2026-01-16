type GameInstance = {
    id: number;
    room_code: string;
    creator_id: number | null;
    creator: User | null;
    max_players: number;
    status: 'pending' | 'active' | 'finished' | null;
    entries: GameEntry[] | null;
}

type GameEntry = {
    id: number;
    game_instance_id: number;
    user_id: number;
    user: User | null;
}

