<?php

namespace App\Services\GamesListServices\Bingo\BingoMatch;

use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;

interface IBingoMatchService
{
    public function createGameMatches(BingoGame $game, GameDifficulty $difficulty, int $answersCount): void;
    public function getCurrentMatch(BingoGame $game): BingoMatch;
    public function getNextMatch(BingoGame $game): BingoMatch;
}