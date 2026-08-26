<?php
namespace App\Enums\Core;

enum TeamType: int
{
    case CLUB = 1;
    case NATIONAL = 2;
    case YOUTH_CLUB = 3;
    case YOUTH_NATIONAL = 4;


    public function label(): string
    {
        return match ($this) {
            self::CLUB => 'Club',
            self::NATIONAL => 'National',
            self::YOUTH_CLUB => 'Youth Club',
            self::YOUTH_NATIONAL => 'Youth National',
        };
    }
}