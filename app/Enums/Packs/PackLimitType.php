<?php


namespace App\Enums\Packs;

enum PackLimitType: int
{
    case ALL_TIME = 0;
    case DAILY = 1;
    case WEEKLY = 2;
    case MONTHLY = 3;

    public function label(): string
    {
        return match ($this) {
            self::ALL_TIME => 'All Time',
            self::DAILY => 'Daily',
            self::WEEKLY => 'Weekly',
            self::MONTHLY => 'Monthly',
        };
    }
}