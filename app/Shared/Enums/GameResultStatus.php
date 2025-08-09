<?php

namespace App\Shared\Enums;

enum GameResultStatus: string
{
    case PLAYING = 'playing';
    case WON = 'won';
    case LOST = 'lost';
}
