<?php

namespace App\Shared\Enums;

enum BingoConnectionType
{
    case PLAYED_FOR;
    case PLAYED_WITH;
    case PLAYED_UNDER;
    case WON;
    case MADE_STATS;
}
