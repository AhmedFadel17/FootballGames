<?php

namespace App\Services\GamesListServices\Bingo\BingoMatch;

use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoGameInstance;
use App\Models\GamesList\Bingo\BingoMatch;

interface IBingoMatchService
{
    public function createGameMatches(BingoGame $game, int $answersCount): void;
    public function getCurrentMatch(BingoGameInstance $bingoGameInstance): ?BingoMatch;
    public function getNextMatch(BingoGameInstance $bingoGameInstance): ?BingoMatch;
}