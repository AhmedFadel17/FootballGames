<?php
namespace App\Enums\Core;

enum TransferType: int
{
    case PERMANENT = 0;
    case LOAN = 1;
    case FREE = 2;
    case LOAN_RETURN = 3;
    case PROMOTION = 4;
    case RETIRED = 5;
    case RELEASED = 6;
    case CONTRACT_RENEWAL = 7;


    public function label(): string
    {
        return match ($this) {
            self::PERMANENT => 'Permanent Transfer',
            self::LOAN => 'Loan',
            self::FREE => 'Free Transfer',
            self::LOAN_RETURN => 'Return from Loan',
            self::PROMOTION => 'Academy Promotion',
            self::RETIRED => 'Retired',
            self::RELEASED => 'Released',
            self::CONTRACT_RENEWAL => 'Contract Renewal',
        };
    }
}