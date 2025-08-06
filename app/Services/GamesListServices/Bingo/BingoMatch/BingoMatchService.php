<?php

namespace App\Services\GamesListServices\Bingo\BingoMatch;

use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchResponseDTO;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;

class BingoMatchService implements IBingoMatchService
{

    public function getByBingoGameId(int $id): BingoMatchResponseDTO
    {
        $bingoGame = BingoGame::query()->findOrFail($id);
        $remaining_answers = $bingoGame->remaining_answers ?? 0;
        if ($remaining_answers == 0) abort(400, "Invalid Request");
        $total_answers = $bingoGame->matches()->count() ?? 0;
        $pos = $total_answers - $remaining_answers;
        $query = BingoMatch::query();
        $bingoMatch = $query->with(['player'])->where('bingo_game_id', $id)->where('pos', $pos)->first();
        if (!$bingoMatch) abort(400, "Invalid Request");
        $bingoGame->update([
            "remaining_answers" => $remaining_answers - 1
        ]);
        return BingoMatchResponseDTO::fromModel($bingoMatch);
    }
}
