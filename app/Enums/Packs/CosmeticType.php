<?php


namespace App\Enums\Packs;

enum CosmeticType: int
{
    case Badge = 1;
    case Jersey = 2;
    case Stadium = 3;
    case Ball = 4;
    case Trophy = 5;

    public function label(): string
    {
        return match ($this) {
            self::Badge => 'Badge',
            self::Jersey => 'Jersey',
            self::Stadium => 'Stadium',
            self::Ball => 'Ball',
            self::Trophy => 'Trophy',
        };
    }
}
