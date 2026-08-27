import { BaseEntity } from "../api";
import { GameResultStatus, GameStatus } from "../enums";

export interface Game extends BaseEntity {
    name: string;
    min_players: number;
    max_players: number;
    slug: string;
    description: string;
    img_src: string;
    is_active: boolean;
};

export interface GameInstance extends BaseEntity {
    game_id: number;
    user_id: number;
    status: GameStatus;
    game?: Game;
    difficulty: string;
    entries?: GameEntry[];
};

export interface GameResult extends BaseEntity {
    game_entry_id: number;
    score: number;
    is_winner: boolean;
    rank: number;
    status: GameResultStatus;
};
export interface GamePrize extends BaseEntity {
    game_instance_id: number;
    rank: number;
    reward: number;
    game_instance?: GameInstance;
};

export interface GameEntry extends BaseEntity {
    game_instance_id: number;
    user_id: number;
    result?: GameResult;
    user?: User;
    game_instance?: GameInstance;
};
