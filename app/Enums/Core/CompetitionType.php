<?php
namespace App\Enums\Core;

enum CompetitionType: int
{
    case DOMESTIC_LEAGUE = 1;
    case DOMESTIC_CUP = 2;
    case CONTINENTAL = 3;
    case INTERCONTINENTAL = 4;


    public function label(): string
    {
        return match ($this) {
            self::DOMESTIC_LEAGUE => 'Domestic League',
            self::DOMESTIC_CUP => 'Domestic Cup',
            self::CONTINENTAL => 'Continental',
            self::INTERCONTINENTAL => 'Intercontinental',
        };
    }
}