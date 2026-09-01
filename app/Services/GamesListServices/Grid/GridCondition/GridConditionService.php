<?php

namespace App\Services\GamesListServices\Grid\GridCondition;


use App\Models\Core\Player;

use App\Models\GamesList\Grid\GridCondition;

use App\Models\GamesList\Grid\GridGame;
use App\Services\GameEngine\ConditionPool\IConditionPoolService;
class GridConditionService implements IGridConditionService
{

    public function __construct(private readonly IConditionPoolService $poolService)
    {
    }

    public function validatePlayerForCell(
        Player $player,
        GridCondition $rowCondition,
        GridCondition $colCondition
    ): bool {
        return $this->satisfiesCondition($player, $rowCondition)
            && $this->satisfiesCondition($player, $colCondition);
    }

    public function satisfiesCondition(Player $player, GridCondition $condition): bool
    {
        $object = $condition->objectable;

        if (!$object || !$player) {
            return false;
        }
        return $this->poolService->validate($player, $object, $condition->object_type);
    }

    public function createGameConditions(GridGame $game): void
    {
        [$rowItems, $colItems] = $this->poolService->generateGridPools($game->difficulty, $game->size);

        $conditions = [];

        foreach ($rowItems as $index => $item) {
            $conditions[] = [
                'grid_game_id' => $game->id,
                'object_type' => $item['type'],
                'object_id' => $item['id'],
                'connection_type' => $item['con'],
                'pos' => $index,
                'type' => 'row',
            ];
        }

        foreach ($colItems as $index => $item) {
            $conditions[] = [
                'grid_game_id' => $game->id,
                'object_type' => $item['type'],
                'object_id' => $item['id'],
                'connection_type' => $item['con'],
                'pos' => $index,
                'type' => 'column',
            ];
        }

        GridCondition::insert($conditions);
    }
}
