<?php

namespace App\Services\GamesListServices\Bingo\BingoGameInstance;


use App\DTOs\GamesList\Bingo\BingoGameInstanceDTO;
use App\Models\GamesList\Bingo\BingoGameInstance;
use App\Models\GamesList\Bingo\BingoGuess;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;

interface IBingoGameInstanceService
{
    public function check(User $user, int $gameId, int $conditionId): array;
    public function nextMatch(User $user, int $gameId): ?BingoMatch;
    public function getCurrentMatch(User $user, int $gameId): ?BingoMatch;
    public function skip(User $user, int $gameId): array;
    public function startGame(User $user, BingoGameInstanceDTO $dto): BingoGameInstance;
    public function getById(User $user, int $id): BingoGameInstance;
}
