<?php
namespace App\Enums\Core;

enum PlayerPosition: int
{
    case UNKNOWN = 0;
    case GOALKEEPER = 1;
    case DEFENDER = 2;
    case MIDFIELDER = 3;
    case FORWARD = 4;


    public function label(): string
    {
        return match ($this) {
            self::UNKNOWN => 'Unknown',
            self::GOALKEEPER => 'Goalkeeper',
            self::DEFENDER => 'Defender',
            self::MIDFIELDER => 'Midfielder',
            self::FORWARD => 'Forward',

        };
    }
    public function code(): string
    {
        return match ($this) {
            self::UNKNOWN => 'UN',
            self::GOALKEEPER => 'GK',
            self::DEFENDER => 'DF',
            self::MIDFIELDER => 'MF',
            self::FORWARD => 'FW',
        };
    }
    public function subPositions(): array
    {
        return match ($this) {
            self::GOALKEEPER => [PlayerSubPosition::GK],
            self::DEFENDER => [
                PlayerSubPosition::CB,
                PlayerSubPosition::LB,
                PlayerSubPosition::RB,
                PlayerSubPosition::LWB,
                PlayerSubPosition::RWB,
            ],
            self::MIDFIELDER => [
                PlayerSubPosition::CDM,
                PlayerSubPosition::CM,
                PlayerSubPosition::CAM,
                PlayerSubPosition::LM,
                PlayerSubPosition::RM,
            ],
            self::FORWARD => [
                PlayerSubPosition::ST,
                PlayerSubPosition::CF,
                PlayerSubPosition::LW,
                PlayerSubPosition::RW,
            ],
        };
    }
}