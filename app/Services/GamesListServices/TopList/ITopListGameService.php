<?php

namespace App\Services\GamesListServices\TopList;

use App\DTOs\Game\GameResult\GameResultResponseDTO;
use App\DTOs\GamesList\TopList\TopListAnswerResponseDTO;
use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\GamesList\TopList\TopListGameResponseDTO;
use App\DTOs\GamesList\TopList\TopListItemResponseDTO;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\User;

interface ITopListGameService
{
    public function create(TopListGameDTO $dto): TopListGame;
    public function getAll(): array;

    public function cancelGame(User $user, int $gameId): void;
    public function startGame(User $user, int $gameId): TopListGameResponseDTO;
    public function check(User $user,int $gameId, int $objectId): TopListAnswerResponseDTO;
    public function results(User $user,int $gameId): GameResultResponseDTO;


}
