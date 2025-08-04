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
        $total_answers = BingoGame::query()->matches()->count ?? 0;
        $pos=$total_answers-$remaining_answers;
        $query = BingoMatch::query();
        $bingoMatch= $query->where('bingo_game_id', $id)->where('pos',$pos)->first();
        return BingoMatchResponseDTO::fromModel($bingoMatch);

    }
}
