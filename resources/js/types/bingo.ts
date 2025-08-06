
type BingoGame = {
    id: number;
    game_instance_id: number;
    size: number;
    remaining_answers: number;
}

type BingoCondition = {
    id: number;
    bingo_game_id: number,
    object_id: number;
    object: Player | Team | null;
    object_type: string,
    match?: BingoMatch | null;
    connection_type: string;
    bingo_match_id: number;
    is_marked: boolean;
    pos: number;
}

type BingoMatch = {
    id: number;
    bingo_game_id: number,
    player_id: number,
    player: Player,
    pos: number;
}