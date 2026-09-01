<?php

namespace App\Services\GameEngine\GameResults;

use App\DTOs\GameEngine\GameResultDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GameEngine\GameResultStatus;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameResult;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use App\Models\User;
use App\Resources\GameEngine\GameResultResource;

interface IGameResultService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): GameResult;
    public function getByGameInstanceId(User $user, int $gameInstanceId): GameResult;
    public function getGameResultsCount(int $gameInstanceId): int;
    public function create(GameResultDTO $dto): GameResult;
    public function update(int $id, GameResultDTO $dto): GameResult;
    public function delete(int $id): void;

    public function calculateRewards(
        Game $game,
        bool $isWon,
        int $durationSeconds,
        int $correctCount,
        int $totalItems,
        GameDifficulty $difficulty
    ): array;
}