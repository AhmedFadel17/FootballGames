<?php

namespace App\Services\GamesListServices\Grid\GridCondition;

use App\Enums\GameEngine\GameDifficulty;
use App\Models\Core\Player;
use App\Models\GamesList\Grid\GridCondition;
use App\Models\GamesList\Grid\GridGame;


interface IGridConditionService
{
    public function validatePlayerForCell(
        Player $player,
        GridCondition $rowCondition,
        GridCondition $colCondition
    ): bool;

    public function satisfiesCondition(Player $player, GridCondition $condition): bool;
    public function createGameConditions(GridGame $game): void;
}