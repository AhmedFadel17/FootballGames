<?php

namespace App\Services\GamesListServices\Career\CareerGameInstance;

use App\DTOs\GamesList\Career\CareerGameInstanceDTO;
use App\Models\GamesList\Career\CareerGame;
use App\Models\GamesList\Career\CareerGameInstance;
use App\Models\User;


interface ICareerGameInstanceService
{
    public function startGame(User $user, CareerGameInstanceDTO $dto): CareerGameInstance;
    public function revealNextStep(User $user, int $careerGameInstanceId): CareerGameInstance;
    public function getById(User $user, int $careerGameInstanceId): CareerGameInstance;
    public function guess(User $user, int $careerGameInstanceId, int $guessedPlayerId): array;
}
