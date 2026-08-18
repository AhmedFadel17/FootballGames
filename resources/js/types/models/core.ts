import { CompetitionType, PlayerPosition, PlayerPreferredFoot } from "../enums";

// Area types
export interface Country {
    id: number;
    name: string;
    code: string;
    img_src: string;
    popularity: number;
    continent_id?: number;
    continent?: Continent;
}

export interface Continent {
    id: number;
    name: string;
    code: string;
}

// Season types
export interface Season {
    id: number;
    name: string;
    start_year: number;
    end_year: number;
}

export interface Competition {
    id: number;
    name: string;
    abbr: string;
    country_id?: number;
    type: CompetitionType;
    founded_year: number;
    tier: number;
    img_src: string;
    popularity?: number;
    is_active: boolean;
    slug: string;
    api_id?: number;
    country?: Country;
}


export interface Manager {
    id: number;
    name: string;
    popularity: number;
    img_src: string;
    slug: string;
    api_id?: number;
    country_id?: number;
    country?: Country;
}

export interface Team {
    id: number;
    name: string;
    abbr: string;
    popularity: number;
    api_id?: number;
    slug?: string;
    img_src: string;
    country_id?: number;
    country?: Country;
}

export interface Player {
    id: number;
    name: string;
    fullname: string;
    position: PlayerPosition;
    date_of_birth: string;
    height_cm: number;
    weight_kg: number;
    popularity: number;
    rating: number;
    market_value: number;
    preferred_foot: PlayerPreferredFoot;
    slug: string;
    api_id?: number;
    img_src: string;
    country_id?: number;
    country?: Country;
}

