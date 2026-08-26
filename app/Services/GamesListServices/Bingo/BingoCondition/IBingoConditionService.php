<?php

namespace App\Services\GamesListServices\Bingo\BingoCondition;

use App\Enums\GameEngine\GameDifficulty;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;

interface IBingoConditionService
{
    public function getByBingoGameId(User $user, int $id): array;
    public static function getByBingoGameIdAndPosition(int $gameId, int $pos): BingoCondition;
    public function createGameConditions(BingoGame $game): void;
    public function validateMatchAgainstCondition(BingoCondition $condition, BingoMatch $match): bool;
}