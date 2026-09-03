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
                    Team::class => 90,
                    Country::class => 90,
                    Manager::class => 90,
                    Continent::class => 90,
                    default => 90,
                },
            self::NORMAL => match ($class) {
                    Player::class => 72,
                    Team::class => 84,
                    Country::class => 70,
                    Manager::class => 85,
                    Continent::class => 70,
                    default => 70,
                },
            self::HARD => match ($class) {
                    Player::class => 42,
                    Team::class => 70,
                    Country::class => 40,
                    Manager::class => 75,
                    Continent::class => 40,
                    default => 40,
                },
        };
    }

    public function multiplier(): float
    {
        return match ($this) {
            self::EASY => 1.0,
            self::NORMAL => 1.5,
            self::HARD => 2.0,
        };
    }

}
