<?php

namespace App\Services\GamesListServices\Bingo\BingoCondition;

use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionDTO;
use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\User;
use App\Services\Pagination\IPaginationService;
use App\Shared\Enums\GameStatus;
use Illuminate\Support\Facades\Log;

class BingoConditionService implements IBingoConditionService
{

    public function getByBingoGameId(User $user,int $id): array
    {
        $bingoGame = BingoGame::query()->findOrFail($id);
        Log::info("ssssssssssssssss");
        Log::info(GameStatus::ACTIVE->value);
        Log::info("instanceeeeeeeeeeeeeeeee");
        Log::info($bingoGame->instance->status->value);


        if ($bingoGame->instance->status !== GameStatus::ACTIVE) abort(400, "Game is not Active");

        $conditions = BingoCondition::query()
            ->with(['objectable', 'match.player'])
            ->where('bingo_game_id', $id)
            ->get();

        return $conditions
            ->map(fn($condition) => BingoConditionResponseDTO::fromModel($condition))
            ->all();
    }
    public static function getByBingoGameIdAndPosition(int $gameId, int $pos): BingoCondition
    {
        $condition = BingoCondition::query()
            ->where('bingo_game_id', $gameId)
            ->where('pos', $pos)
            ->firstOrFail();
        return $condition;
    }
}
