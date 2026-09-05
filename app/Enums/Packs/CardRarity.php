<?php


namespace App\Enums\Packs;

enum CardRarity: int
{
    case COMMON = 1;
    case RARE = 2;
    case LEGEND = 3;
    case SPECIAL = 4;

    public function label(): string
    {
        return match ($this) {
            self::COMMON => 'Common',
            self::RARE => 'Rare',
            self::LEGEND => 'Legend',
            self::SPECIAL => 'Special',
        };
    }
}