<?php

namespace App\Services\GamesListServices\Grid\GridAnswer;

use App\DTOs\GamesList\GridGameAnswerDTO;
use App\Models\GamesList\Grid\GridGame;
use App\Models\GamesList\Grid\GridAnswer;
use App\Models\User;

interface IGridAnswerService
{


    public function updateRarityScore(GridGame $game, int $rowIndex, int $columnIndex, int $playerId): void;
}