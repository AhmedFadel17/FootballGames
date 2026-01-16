type GuessThePlayerGame = {
    id: number;
    game_instance_id: number;
    game_instance: GameInstance | null;
    players_count: number;
    assignments: GuessThePlayerGameAssignment[];
}

type GuessThePlayerGameAssignment = {
    id: number;
    guess_the_player_game_id: number;
    game_entry_id: number;
    entry: GameEntry | null;
    target_player_id: number;
    player: Player | null;
    is_me:boolean;
    is_solved: boolean;
    solved_at: string;
}
