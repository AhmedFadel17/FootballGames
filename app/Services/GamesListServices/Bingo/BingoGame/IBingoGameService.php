<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;


use App\DTOs\GamesList\BingoGameDTO;
use App\Models\GameEngine\GameResult;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;


interface IBingoGameService
{
    public function check(User $user, int $gameId, int $conditionId): BingoCondition;
    public function nextMatch(User $user, int $gameId): BingoMatch;
    public function create(User $user, BingoGameDTO $dto): BingoGame;
    public function getById(User $user, int $id): BingoGame;
}
