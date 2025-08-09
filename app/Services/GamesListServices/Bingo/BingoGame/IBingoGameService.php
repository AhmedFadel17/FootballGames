<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;

use App\DTOs\Game\GameResult\GameResultResponseDTO;
use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionResponseDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameResponseDTO;
use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\User;
use App\Shared\Enums\GameDifficulty;
use App\Shared\Enums\GameStatus;

interface IBingoGameService
{
    public function check(User $user,int $gameId, int $conditionId): BingoConditionResponseDTO;
    // public function checkGame(int $gameId): bool;
    // public function finishGame(User $user,BingoGame $game,GameStatus $status): void;
    public function cancelGame(User $user, int $gameId): void;
    // public function getConditions(User $user, int $gameId): array;
    // public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO;
    // public function getById(int $id): BingoGameResponseDTO;
    public function nextMatch(User $user,int $gameId): BingoMatchResponseDTO;
    public function results(User $user,int $gameId): GameResultResponseDTO;
    public function create(User $user,int $game_id, int $size, string $difficulty): BingoGameResponseDTO;
}
