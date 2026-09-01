import { BingoConnectionType, TopListItemstype } from './../enums/gameList';
import { BaseEntity } from "../api";
import { GameDifficulty, GridCellType } from "../enums";
import { Country, Player, PlayerTeamPeriod, Team } from "./core";


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


// grid game models
export interface GridGame extends BaseEntity {
    size: number;
    difficulty: GameDifficulty;
    conditions?: GridCondition[];
}

export interface GridGameInstance extends BaseEntity {
    game_instance_id: number;
    max_attempts: number;
    answers: GridAnswer[];
    grid_game: GridGame;
}

export interface GridCondition extends BaseEntity {
    grid_game_id: number,
    object_id: number;
    object: Player | Team | Country | null;
    object_type: string,
    connection_type: BingoConnectionType;
    type: GridCellType;
    pos: number;
}

export interface GridAnswer extends BaseEntity {
    grid_game_instances_id: number,
    game_entry_id: number,
    player_id: number,
    player: Player,
    row_index: number,
    column_index: number,
    is_correct: boolean,
    rarity_score: number,
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
    title: string;
    description: string | null;
    items_type: TopListItemstype;
    total_items: number;
    difficulty: string;
    items?: TopListItem[];
}

export interface TopListGameInstance extends BaseEntity {
    game_instance_id: number;
    max_attempts: number;
    guesses?: TopListGuess[];
    question?: TopListGame;
    masterQuestion?: TopListGame;
}

export interface TopListGuess extends BaseEntity {
    top_list_game_instance_id: number;
    game_entry_id: number;
    object_id: number;
    object_type?: string;
    object?: {
        id: number;
        name: string;
        img_src?: string;
    };
    is_correct: boolean;
    matched_rank?: number | null;
    guessed_at?: string;
}

export interface TopListItem extends BaseEntity {
    top_list_game_id: number;
    rank: number;
    display_value?: string | null;
    object_id: number;
    object?: {
        id: number;
        name: string;
        img_src?: string;
    };
}






