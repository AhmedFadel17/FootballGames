import { BaseEntity } from "../api";
import { Player, PlayerTeamPeriod, Team } from "./core";


// bingo game models
export interface BingoGame extends BaseEntity {
    game_instance_id: number;
    size: number;
    remaining_answers: number;
}

export interface BingoCondition extends BaseEntity {
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

export interface BingoMatch extends BaseEntity {
    bingo_game_id: number,
    player_id: number,
    player: Player,
    pos: number;
}

// career game models
export interface CareerGame extends BaseEntity {
    game_instance_id: number;
    player_id: number;
    player: Player | null;
    total_steps: number;
    revealed_steps: number;
    attempts_left: number;
    steps: CareerStep[];
}

export interface CareerStep {
    step_number: number;
    is_revealed: boolean;
    team: Team | null;
    start_year: string;
    end_year: string;
}


// guess the player game models
export interface GuessThePlayerGame extends BaseEntity {
    game_instance_id: number;
    game_instance: GameInstance | null;
    players_count: number;
    assignments: GuessThePlayerGameAssignment[];
}

export interface GuessThePlayerGameAssignment extends BaseEntity {
    guess_the_player_game_id: number;
    game_entry_id: number;
    entry: GameEntry | null;
    target_player_id: number;
    player: Player | null;
    is_me: boolean;
    is_solved: boolean;
    solved_at: string;
}

// toplist game models
export interface TopListGame extends BaseEntity {
    game_instance_id: number;
    title: string;
    type: string;
    size: number;
    max_chances: number;
    items?: TopListItem[];
    answers?: TopListAnswer[];
}

export interface TopListItem extends BaseEntity {
    pos: number;
    object_id: number;
    object?: {
        id: number;
        name: string;
        img_src: string;
    };
}

export interface TopListAnswer extends BaseEntity {
    top_list_item_id: number;
    game_entry_id: number;
    item?: TopListItem | null;
}





