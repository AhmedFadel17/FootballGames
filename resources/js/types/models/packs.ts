import { BaseEntity } from "../api";
import { CardRarity, CosmeticType, PackItemType, PowerupType } from "./../enums";
import { Player } from "./core";

// Event Models
export interface Event extends BaseEntity {
    name: string;
    slug: string;
    description?: string | null;
    img_src?: string | null;
    is_active: boolean;
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
    rarity: CardRarity | string;
    position: string;
    img_src?: string | null;
    stats?: PlayerCardStats | null;
    player?: Player;
    event?: Event | null;
}

// Powerup Models
export interface Powerup extends BaseEntity {
    name: string;
    slug: string;
    type: PowerupType | string;
    rarity: CardRarity | string;
    description?: string | null;
    icon_src?: string | null;
    multiplier?: number | null;
    duration?: number | null;
}

// Cosmetic Models
export interface Cosmetic extends BaseEntity {
    name: string;
    type: CosmeticType | string;
    rarity: CardRarity | string;
    description?: string | null;
    img_src?: string | null;
    is_active: boolean;
}

// Pack & Drop Rule Models
export interface PackDropRule extends BaseEntity {
    pack_id: number;
    item_type: PackItemType | string;
    min_rating?: number | null;
    max_rating?: number | null;
    drop_chance: number;
    pack?: Pack;
}

export interface Pack extends BaseEntity {
    event_id?: number | null;
    name: string;
    description?: string | null;
    img_src?: string | null;
    price_coins: number;
    cards_count: number;
    is_active: boolean;
    event?: Event | null;
    drop_rules?: PackDropRule[];
}

// Pack Opening Result Models
export interface OpenedPackItem {
    item_type: PackItemType | string;
    data: PlayerCard | Powerup | Cosmetic | Record<string, unknown>;
}

export interface PackOpeningResult {
    pack_id: number;
    opened_at: string;
    items: OpenedPackItem[];
}