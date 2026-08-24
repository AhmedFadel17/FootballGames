<?php

namespace App\Enums\GameEngine;

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

}
