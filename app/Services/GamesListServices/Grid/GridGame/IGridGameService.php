<?php

namespace App\Services\GamesListServices\Grid\GridGame;

use App\DTOs\GamesList\GridGameAnswerDTO;
use App\Models\GameEngine\GameEntry;
use App\DTOs\GamesList\GridGameDTO;
use App\Models\GamesList\Grid\GridAnswer;
use App\Models\GamesList\Grid\GridGame;
use App\Models\User;

interface IGridGameService
{
    public function createGame(User $user, GridGameDTO $dto): GridGame;
    public function getGameDetails(int $gridGameId): GridGame;
    public function getGridStateForEntry(GridGame $game, GameEntry $entry): array;
    public function isGridCompleted(GridGame $game, GameEntry $entry): bool;

    public function submitAnswer(
        User $user,
        int $gameId,
        GridGameAnswerDTO $dto
    ): array;

}