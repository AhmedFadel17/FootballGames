<?php

namespace App\Services\GamesListServices\TopList\TopListGameInstance;


use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\GamesList\TopList\TopListGameInstanceDTO;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListGameInstance;
use App\Models\GamesList\TopList\TopListGuess;
use App\Models\User;

interface ITopListGameInstanceService
{
    public function startGame(User $user, TopListGameInstanceDTO $dto): TopListGameInstance;
    public function check(User $user, int $gameId, int $objectId): TopListGuess;
    public function getGameInstanceDetails(int $id): TopListGameInstance;
}
