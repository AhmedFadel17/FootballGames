import { UserRole } from "../enums";

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    avatar?: string;
    favorite_team?: string;
    role: UserRole;
}

export interface UserProgress {
    coins: number;
    points: number;
    xp: number;
    next_level_xp: number;
    level: number;
    stamina: number;
    max_stamina: number;
    last_stamina_update: string;
}