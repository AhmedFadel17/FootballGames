<?php

namespace App\Enums\GameEngine;

enum GameResultStatus: string
{
    case PLAYING = 'playing';
    case WON = 'won';
    case LOST = 'lost';
}
