<?php

namespace App\Services\Core\Players;

use App\DTOs\Core\PlayerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Manager;
use App\Models\Core\Player;
use App\Models\Core\Team;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IPlayerService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getOptions(string $query, int $limit = 10): Collection;
    public function getById(int $id): Player;
    public function create(PlayerDTO $data): Player;
    public function update(int $id, PlayerDTO $data): Player;
    public function delete(int $id): bool;

    public function getRandom(int $minPopularity, bool $includeRetired = false, int $limit = 10): Collection;
    public function playedTogether(Player $player1, Player $player2): bool;
    public function playedForTeam(Player $player, Team $team): bool;
    public function playedUnderManager(Player $player, Manager $manager): bool;
}
