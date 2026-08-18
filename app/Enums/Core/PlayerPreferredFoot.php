<?php
namespace App\Enums\Core;

enum PlayerPreferredFoot: int
{
    case UNKNOWN = 0;
    case RIGHT = 1;
    case LEFT = 2;
    case BOTH = 3;
    case BOTTOM = 4;

    public function label(): string
    {
        return match ($this) {
            self::RIGHT => 'Right',
            self::LEFT => 'Left',
            self::BOTH => 'Both',
            self::BOTTOM => 'Bottom',
            self::UNKNOWN => 'Unknown',
        };
    }
}