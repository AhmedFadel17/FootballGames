<?php
namespace App\Enums\Core;

enum PlayerSubPosition: int
{
    // Goalkeeper
    case GK = 1;

    // Defenders
    case CB = 10;
    case LB = 11;
    case RB = 12;
    case LWB = 13;
    case RWB = 14;

    // Midfielders
    case DM = 19;
    case CDM = 20;
    case CM = 21;
    case CAM = 22;
    case LM = 23;
    case RM = 24;
    case LAM = 25;
    case RAM = 26;

    // Forwards
    case ST = 30;
    case CF = 31;
    case LW = 32;
    case RW = 33;

    /**
     * Map the sub-position back to its parent category.
     */
    public function parentPosition(): PlayerPosition
    {
        return match ($this) {
            self::GK => PlayerPosition::GOALKEEPER,

            self::CB, self::LB, self::RB, self::LWB, self::RWB => PlayerPosition::DEFENDER,

            self::CDM, self::CM, self::CAM, self::LM, self::RM => PlayerPosition::MIDFIELDER,

            self::ST, self::CF, self::LW, self::RW => PlayerPosition::FORWARD,
        };
    }

    public function code(): string
    {
        return $this->name;
    }

    public function label(): string
    {
        return match ($this) {
            self::GK => 'Goalkeeper',
            self::CB => 'Centre-Back',
            self::LB => 'Left-Back',
            self::RB => 'Right-Back',
            self::LWB => 'Left Wing-Back',
            self::RWB => 'Right Wing-Back',
            self::DM => 'Defensive Midfielder',
            self::CDM => 'Central Defensive Midfielder',
            self::CM => 'Central Midfielder',
            self::CAM => 'Central Attacking Midfielder',
            self::LM => 'Left Midfielder',
            self::LAM => 'Left Attacking Midfielder',
            self::RM => 'Right Midfielder',
            self::RAM => 'Right Attacking Midfielder',
            self::ST => 'Striker',
            self::CF => 'Centre-Forward',
            self::LW => 'Left Winger',
            self::RW => 'Right Winger',
        };
    }

    public static function fromCode(string|int|null $code): ?self
    {
        if (empty($code)) {
            return null;
        }

        if (is_numeric($code)) {
            return self::tryFrom((int) $code);
        }

        $upperCode = strtoupper(trim((string) $code));

        foreach (self::cases() as $case) {
            if ($case->name === $upperCode) {
                return $case;
            }
        }

        return null;
    }
}