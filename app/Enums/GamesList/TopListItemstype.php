<?php

namespace App\Enums\GamesList;

enum TopListItemstype: int
{
    case PLAYER = 1;
    case TEAM = 2;
    case COUNTRY = 3;
    case CONTINENT = 4;
    case MANAGER = 5;

    public function label(): string
    {
        return match ($this) {
            self::PLAYER => 'Player',
            self::TEAM => 'Team',
            self::COUNTRY => 'Country',
            self::CONTINENT => 'Continent',
            self::MANAGER => 'Manager',
        };
    }
}
