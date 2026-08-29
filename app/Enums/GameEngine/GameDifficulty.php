<?php

namespace App\Enums\GameEngine;

use App\Models\Core\Continent;
use App\Models\Core\Country;
use App\Models\Core\Manager;
use App\Models\Core\Player;
use App\Models\Core\Team;

enum GameDifficulty: int
{
    case EASY = 1;
    case NORMAL = 2;
    case HARD = 3;

    public function label(): string
    {
        return match ($this) {
            self::EASY => 'Easy',
            self::NORMAL => 'Normal',
            self::HARD => 'Hard',
        };
    }

    public function minPopularity(string $class): int
    {
        return match ($this) {
            self::EASY => match ($class) {
                    Player::class => 92,
                    Team::class => 88,
                    Country::class => 90,
                    Manager::class => 80,
                    Continent::class => 90,
                    default => 90,
                },
            self::NORMAL => 70,
            self::HARD => 40,
        };
    }

}
