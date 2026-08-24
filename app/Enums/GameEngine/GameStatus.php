<?php

namespace App\Enums\GameEngine;

enum GameStatus: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case FINISHED = 'finished';
    case CANCELLED = 'cancelled';
}
