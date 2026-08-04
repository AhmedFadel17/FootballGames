<?php
namespace App\Enums\Core;

enum PlayerPosition: int
{
    case GOALKEEPER = 1;
    case DEFENDER = 2;
    case MIDFIELDER = 3;
    case FORWARD = 4;


    public function label(): string
    {
        return match ($this) {
            self::GOALKEEPER => 'Goalkeeper',
            self::DEFENDER => 'Defender',
            self::MIDFIELDER => 'Midfielder',
            self::FORWARD => 'Forward',

        };
    }
}