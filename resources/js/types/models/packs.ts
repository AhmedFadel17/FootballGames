import { BaseEntity } from "../api";
import { CardRarity, CosmeticType, PackItemType, PackLimitType, PlayerPosition, PowerupType } from "./../enums";
import { Player } from "./core";

// Event Models
export interface Event extends BaseEntity {
    name: string;
    slug: string;
    description?: string | null;
    img_src?: string | null;
    theme_color?: string;
    is_active: boolean;
    start_date?: string | null;
    end_date?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    packs?: Pack[];
    player_cards?: PlayerCard[];
    cards_count?: number;
}

// Player Card Models
export interface PlayerCardStats {
    pace?: number;
    shooting?: number;
    passing?: number;
    dribbling?: number;
    defending?: number;
    physical?: number;
    [key: string]: number | undefined;
}

export interface PlayerCard extends BaseEntity {
    player_id: number;
    event_id?: number | null;
    rating: number;
    rarity: CardRarity;
    position: PlayerPosition;
    img_src?: string | null;
    is_packable?: boolean;
    stats?: PlayerCardStats | null;
    player?: Player;
    event?: Event | null;
}

// Powerup Models
export interface Powerup extends BaseEntity {
    name: string;
    slug: string;
    type: PowerupType;
    rarity: CardRarity;
    description: string;
    img_src: string;
    multiplier: number;
    duration: number;
}

// Cosmetic Models
export interface Cosmetic extends BaseEntity {
    name: string;
    slug: string;
    description: string;
    type: CosmeticType;
    rarity: CardRarity;
    img_src: string;
    is_active: boolean;
}

// Pack & Drop Rule Models
export interface PackDropRule extends BaseEntity {
    pack_id: number;
    drop_type: string;
    item_type?: PackItemType | string;
    rarity?: CardRarity | number | null;
    event_id?: number | null;
    min_coins?: number;
    max_coins?: number;
    drop_percentage: number;
    drop_chance?: number;
    min_rating?: number | null;
    max_rating?: number | null;
    pack?: Pack;
    event?: Event | null;
}

export interface Pack extends BaseEntity {
    slug: string;
    name: string;
    description?: string | null;
    img_src?: string | null;
    price_coins: number;
    cards_count: number;
    required_level?: number;
    user_limit?: number | null;
    limit_type?: PackLimitType | number;
    is_active: boolean;
    event_id?: number | null;
    event?: Event | null;
    drop_rules?: PackDropRule[];
}

// Pack Opening Result Models
export interface OpenedPackItem {
    item_type: 'player_card' | 'coins' | 'powerup' | 'cosmetic' | string;
    amount?: number | null;
    data: any;
}

export interface PackOpeningResult {
    pack_id: number;
    pack?: Pack;
    user_coins?: number;
    coins_spent?: number;
    coins_earned?: number;
    opened_at: string;
    items: OpenedPackItem[];
}

export interface UserPlayerCard {
    user_card_id: number;
    quantity: number;
    obtained_at?: string;
    id: number;
    player_id: number;
    event_id?: number | null;
    rarity: number;
    rating: number;
    position?: string;
    img_src?: string | null;
    player?: {
        id: number;
        name: string;
        fullname?: string;
        position?: string | number;
        img_src?: string;
        country?: {
            id: number;
            name: string;
            code?: string;
        } | null;
    } | null;
    event?: {
        id: number;
        name: string;
        slug: string;
        theme_color?: string;
    } | null;
}

export interface UserInventoryPowerup {
    id: number;
    powerup_id: number;
    quantity: number;
    powerup: Powerup;
}

export interface UserInventoryCosmetic {
    id: number;
    cosmetic_id: number;
    quantity: number;
    cosmetic: Cosmetic;
}

export interface SquadLineup {
    formation: string;
    slots: Record<string, UserPlayerCard | null>;
}