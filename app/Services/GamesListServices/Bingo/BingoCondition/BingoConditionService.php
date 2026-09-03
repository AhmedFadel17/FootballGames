<?php

namespace App\Services\GamesListServices\Bingo\BingoCondition;

use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoGameInstance;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;
use App\Resources\GamesList\Bingo\BingoConditionResource;
use App\Enums\GameEngine\GameStatus;
use App\Services\Core\Continents\IContinentService;
use App\Services\Core\Countries\ICountryService;
use App\Services\Core\Managers\IManagerService;
use App\Services\Core\Teams\ITeamService;
use App\Services\GameEngine\ConditionPool\ConditionPoolService;
use App\Services\Core\Players\IPlayerService;
use Illuminate\Database\Eloquent\Collection;
class BingoConditionService implements IBingoConditionService
{

    public function __construct(
        private readonly IPlayerService $_playerService,
        private readonly ICountryService $_countryService,
        private readonly ITeamService $_teamService,
        private readonly IManagerService $_managerService,
        private readonly IContinentService $_continentService,
        private readonly ConditionPoolService $poolService,
    ) {
    }

    public function getByBingoGameId(User $user, int $id): Collection
    {
        $bingoGame = BingoGameInstance::query()->with(['gameInstance', 'bingoGame'])->findOrFail($id);
        if ($bingoGame->gameInstance->status !== GameStatus::ACTIVE)
            abort(400, "Game is not Active");

        return $bingoGame->bingoGame->conditions()->orderBy('pos')->with('objectable')->get();
    }
    public static function getByBingoGameIdAndPosition(int $gameId, int $pos): BingoCondition
    {
        $condition = BingoCondition::query()
            ->with(['objectable'])
            ->where('bingo_game_id', $gameId)
            ->where('pos', $pos)
            ->firstOrFail();
        return $condition;
    }

    public function createGameConditions(BingoGame $game): void
    {
        $size = $game->size;
        $items = $this->poolService
            ->generatePool($game->difficulty, $size)
            ->take($size * $size);

        $conditions = [];
        foreach ($items as $index => $item) {
            $conditions[] = [
                'bingo_game_id' => $game->id,
                'object_type' => $item['type'],
                'object_id' => $item['id'],
                'connection_type' => $item['con'],
                'pos' => $index,
            ];
        }

        BingoCondition::insert($conditions);
    }

    public function validateMatchAgainstCondition(BingoCondition $condition, BingoMatch $match): bool
    {
        $object = $condition->objectable;
        $player = $match->player;

        if (!$object || !$player) {
            return false;
        }

        return $this->poolService->validate($player, $object, $condition->object_type);
    }
}
