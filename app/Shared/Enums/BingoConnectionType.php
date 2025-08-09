<?php

namespace App\Shared\Enums;

enum BingoConnectionType:string
{
    case PLAYED_FOR="played for";
    case PLAYED_WITH="played with";
    case PLAYED_UNDER="played under manager";
    case FROM="from";
    case WON="won";
    case MADE_STATS="made";
}
