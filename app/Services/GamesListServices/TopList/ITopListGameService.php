<?php

namespace App\Services\GamesListServices\TopList;

use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\User;

interface ITopListGameService
{
    public function create(TopListGameDTO $dto): TopListGame;
    public function cancelGame(User $user, int $gameId): void;

}
