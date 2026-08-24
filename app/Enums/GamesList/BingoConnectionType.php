<?php

namespace App\Enums\GamesList;

enum BingoConnectionType: string
{
    case PLAYED_FOR = "played for";
    case PLAYED_WITH = "played with";
    case COACHED_BY = "coached by";
    case FROM = "from";
    case WON = "won";
    case MADE_STATS = "made";
}
