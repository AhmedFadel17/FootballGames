<?php

namespace App\Services\GameEngine\GameInstances;

use App\DTOs\GameEngine\GameInstanceDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameInstance;
use App\Models\GameEngine\GameResult;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IGameInstanceService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): GameInstance;
    public function create(GameInstanceDTO $dto): GameInstance;
    public function update(int $id, GameInstanceDTO $dto): GameInstance;
    public function delete(int $id): void;
    public function leaveRoom(User $user, int $roomId): void;
    public function cancelRoom(int $roomId): void;
    public function removeMember(int $roomId, int $memberId): void;

    public function startSession(User $user, Game $game): array;
    public function finishSession(
        GameInstance $gameInstance,
        GameEntry $gameEntry,
        bool $isWon,
        int $correctCount,
        int $totalItems,
        int $durationSeconds,
        mixed $difficulty,
        int $rank = 1,
        ?int $calculatedScore = null
    ): GameResult;
}
