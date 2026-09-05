<?php


namespace App\Enums\Packs;

enum PowerupType: int
{
    case COIN_BOOSTER = 1;
    case SCORE_MULTIPLIER = 2;
    case STREAK_SHIELD = 3;
    case TIME_EXTENDER = 4;

    public function label(): string
    {
        return match ($this) {
            self::COIN_BOOSTER => 'Coin Booster',
            self::SCORE_MULTIPLIER => 'Score Multiplier',
            self::STREAK_SHIELD => 'Streak Shield',
            self::TIME_EXTENDER => 'Time Extender',
        };
    }
}

