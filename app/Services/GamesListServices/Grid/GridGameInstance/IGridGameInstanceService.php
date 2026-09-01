<?php

namespace App\Services\GamesListServices\Grid\GridGameInstance;

use App\DTOs\GamesList\Grid\GridGameAnswerDTO;
use App\DTOs\GamesList\Grid\GridGameInstanceDTO;
use App\Models\GameEngine\GameEntry;
use App\Models\GamesList\Grid\GridAnswer;
use App\Models\GamesList\Grid\GridGame;
use App\Models\GamesList\Grid\GridGameInstance;
use App\Models\User;

interface IGridGameInstanceService
{
    public function startGame(User $user, GridGameInstanceDTO $dto): GridGameInstance;
    public function getGameDetails(int $gridGameId): GridGameInstance;
    public function getGridStateForEntry(GridGame $game, GameEntry $entry): array;
    public function isGridCompleted(GridGame $game, GameEntry $entry): bool;

    public function submitAnswer(
        User $user,
        int $gameId,
        GridGameAnswerDTO $dto
    ): array;

}