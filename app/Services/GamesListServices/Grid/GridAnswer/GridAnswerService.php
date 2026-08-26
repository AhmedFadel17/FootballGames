<?php

namespace App\Services\GamesListServices\Grid\GridAnswer;

use App\DTOs\GamesList\GridGameAnswerDTO;
use App\Enums\GamesList\GridCellType;
use App\Models\GamesList\Grid\GridAnswer;
use App\Models\GamesList\Grid\GridGame;
use App\Models\GameEngine\GameEntry;
use App\Models\Core\Player;
use App\Models\User;
use App\Services\GamesListServices\Grid\GridValidation\IGridValidationService;
use Illuminate\Support\Facades\DB;

class GridAnswerService implements IGridAnswerService
{
    public function __construct(
        private IGridValidationService $validationService
    ) {
    }



    public function updateRarityScore(GridGame $game, int $rowIndex, int $columnIndex, int $playerId): void
    {
        $totalCellCorrectAnswers = GridAnswer::where('grid_game_id', $game->id)
            ->where('row_index', $rowIndex)
            ->where('column_index', $columnIndex)
            ->where('is_correct', true)
            ->count();

        if ($totalCellCorrectAnswers === 0)
            return;

        $playerAnswersCount = GridAnswer::where('grid_game_id', $game->id)
            ->where('row_index', $rowIndex)
            ->where('column_index', $columnIndex)
            ->where('player_id', $playerId)
            ->where('is_correct', true)
            ->count();

        // Percentage of players who picked this exact player for this cell
        $rarityScore = round(($playerAnswersCount / $totalCellCorrectAnswers) * 100, 2);

        GridAnswer::where('grid_game_id', $game->id)
            ->where('row_index', $rowIndex)
            ->where('column_index', $columnIndex)
            ->where('player_id', $playerId)
            ->update(['rarity_score' => $rarityScore]);
    }
}