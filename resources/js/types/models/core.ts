import { BaseEntity } from "../api";
import { CompetitionType, PlayerPosition, PlayerPreferredFoot, TeamType } from "../enums";

// Area types
export interface Country extends BaseEntity {
    name: string;
    code: string;
    img_src: string;
    popularity: number;
    continent_id?: number;
    continent?: Continent;
    is_federation: boolean;
}

export interface Continent extends BaseEntity {
    name: string;
    code: string;
    img_src: string;
    popularity: number;
}

// Season types
export interface Season extends BaseEntity {
    name: string;
    start_year: number;
    end_year: number;
}

export interface Competition extends BaseEntity {
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

export interface Standing extends BaseEntity {
    competition_season_id: number;
    team_id: number;
    position: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    points: number;
    team?: Team;
    competition_season?: CompetitionSeason;
}

export interface CompetitionSeason extends BaseEntity {
    competition_id: number;
    season_id: number;
    winner_team_id?: number;
    competition?: Competition;
    season?: Season;
    winner_team?: Team;
    standings?: Standing[];
}

export interface ManagerTeamPeriod extends BaseEntity {
    manager_id: number;
    team_id: number;
    start_date?: string;
    end_date?: string;
    team?: Team;
    manager?: Manager;
}

export interface Manager extends BaseEntity {
    name: string;
    popularity: number;
    img_src: string;
    slug: string;
    api_id?: number;
    is_retired: boolean;
    current_team_id?: number;
    current_team?: Team;
    country_id?: number;
    country?: Country;
    team_periods?: ManagerTeamPeriod[];
}

export interface Team extends BaseEntity {
    name: string;
    abbr: string;
    popularity: number;
    api_id?: number;
    slug?: string;
    img_src: string;
    type: TeamType;
    current_competition_id?: number;
    country_id?: number;
    titles_won?: number;
    country?: Country;
    current_competition?: Competition;
    current_squad?: Player[];
    current_manager?: Manager;
    honors?: CompetitionSeason[];
    standings?: Standing[];
    manager_periods?: ManagerTeamPeriod[];
}

export interface PlayerTeamPeriod extends BaseEntity {
    player_id: number;
    team_id: number;
    start_date?: string;
    end_date?: string;
    is_loan?: boolean;
    is_current?: boolean;
    team?: Team;
}

export interface Transfer extends BaseEntity {
    player_id: number;
    from_team_id?: number;
    to_team_id?: number;
    transfer_date: string;
    transfer_type?: string | number;
    fee_eur?: number;
    from_team?: Team;
    to_team?: Team;
}

export interface PlayerSeasonStat extends BaseEntity {
    player_id: number;
    team_id?: number;
    competition_id?: number;
    season_id?: number;
    appearances?: number;
    goals?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes?: number;
    rating?: number;
    team?: Team;
    is_detail: boolean;
    competition?: Competition;
    season?: Season;
}

export interface PlayerCareerSummary extends BaseEntity {
    player_id: number;
    team_id?: number;
    appearances?: number;
    goals?: number;
    assists?: number;
    yellow_cards?: number;
    red_cards?: number;
    minutes?: number;
    team?: Team;
}

export interface Player extends BaseEntity {
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
    is_retired: boolean;
    current_team_id?: number;
    current_team?: Team;
    country_id?: number;
    country?: Country;
    team_periods?: PlayerTeamPeriod[];
    transfers?: Transfer[];
    career_season_stats?: PlayerSeasonStat[];
    career_summaries?: PlayerCareerSummary[];
}

