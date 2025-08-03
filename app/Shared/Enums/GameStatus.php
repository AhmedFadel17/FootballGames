<?php

namespace App\Shared\Enums;

enum GameStatus:string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case FINISHED = 'finished';
    case CANCELLED = 'cancelled';
}
