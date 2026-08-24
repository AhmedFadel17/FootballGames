import { UserRole } from "../enums";

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    avatar?: string;
    coins: number;
    games_played: number;
    games_won: number;
    games_lost: number;
    favorite_team?: string;
    role: UserRole;
}