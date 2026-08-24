<?php

namespace App\Services\GamesListServices\Bingo\BingoCondition;

use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\User;
use App\Resources\GamesList\Bingo\BingoConditionResource;
use App\Enums\GameEngine\GameStatus;

class BingoConditionService implements IBingoConditionService
{

    public function getByBingoGameId(User $user, int $id): array
    {
        $bingoGame = BingoGame::query()->findOrFail($id);
        if ($bingoGame->instance->status !== GameStatus::ACTIVE)
            abort(400, "Game is not Active");

        $conditions = BingoCondition::query()
            ->with(['objectable', 'match.player'])
            ->where('bingo_game_id', $id)
            ->get();

        return $conditions
            ->map(fn($condition) => new BingoConditionResource($condition))
            ->all();
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
}
