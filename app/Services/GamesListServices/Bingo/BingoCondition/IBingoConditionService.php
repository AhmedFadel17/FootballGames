<?php

namespace App\Services\GamesListServices\Bingo\BingoCondition;

use App\Enums\GameEngine\GameDifficulty;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface IBingoConditionService
{
    public function getByBingoGameId(User $user, int $id): Collection;
    public static function getByBingoGameIdAndPosition(int $gameId, int $pos): BingoCondition;
    public function createGameConditions(BingoGame $game): void;
    public function validateMatchAgainstCondition(BingoCondition $condition, BingoMatch $match): bool;
}