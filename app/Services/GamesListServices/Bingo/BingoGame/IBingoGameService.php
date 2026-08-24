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
    // public function checkGame(int $gameId): bool;
    // public function finishGame(User $user,BingoGame $game,GameStatus $status): void;
    public function cancelGame(User $user, int $gameId): void;
    // public function getConditions(User $user, int $gameId): array;
    // public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO;
    // public function getById(int $id): BingoGameResponseDTO;
    public function nextMatch(User $user, int $gameId): BingoMatch;
    public function results(User $user, int $gameId): GameResult;
    public function create(User $user, BingoGameDTO $dto): BingoGame;
}
