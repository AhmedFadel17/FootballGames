<?php

namespace App\Services\GamesListServices\Bingo\BingoMatch;

use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;

interface IBingoMatchService
{
    public function createGameMatches(BingoGame $game, int $answersCount): void;
    public function getCurrentMatch(BingoGame $game): BingoMatch;
    public function getNextMatch(BingoGame $game): BingoMatch;
}