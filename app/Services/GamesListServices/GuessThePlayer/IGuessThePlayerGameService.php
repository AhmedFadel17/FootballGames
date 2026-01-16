<?php

namespace App\Services\GamesListServices\GuessThePlayer;

use App\DTOs\GamesList\GuessThePlayer\CreateGuessThePlayerGameDto;
use App\DTOs\GamesList\GuessThePlayer\JoinGuessThePlayerGameDto;
use App\Models\User;
use App\Resources\GamesList\GuessThePlayerRescource;

interface IGuessThePlayerGameService
{
    public function start($instanceId);
    public function create(User $user,CreateGuessThePlayerGameDto $dto) : GuessThePlayerRescource;
    public function joinWithCode(User $user,JoinGuessThePlayerGameDto $dto) : GuessThePlayerRescource;
    public function join(User $user) : GuessThePlayerRescource;
    public function getByInstanceId(User $user,$instanceId) : GuessThePlayerRescource;
    public function getById(User $user,$id) : GuessThePlayerRescource;


}
