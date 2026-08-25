<?php

namespace App\Services\GamesListServices\Career;


use App\DTOs\GamesList\CareerGameDTO;
use App\Models\GamesList\Career\CareerGame;
use App\Models\User;


interface ICareerGameService
{
    public function create(User $user, CareerGameDTO $dto): CareerGame;
    public function revealNextStep(User $user, int $careerGameId): CareerGame;
    public function getById(User $user, int $careerGameId): CareerGame;

    public function guess(User $user, int $careerGameId, int $guessedPlayerId): array;
}
