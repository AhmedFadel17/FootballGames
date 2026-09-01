<?php

namespace App\Services\GamesListServices\Grid\GridAnswer;

use App\Models\GamesList\Grid\GridGameInstance;
use App\Models\User;

interface IGridAnswerService
{


    public function updateRarityScore(GridGameInstance $game, int $rowIndex, int $columnIndex, int $playerId): void;
}