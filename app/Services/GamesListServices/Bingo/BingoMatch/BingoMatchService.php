<?php

namespace App\Services\GamesListServices\Bingo\BingoMatch;

use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchResponseDTO;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;

class BingoMatchService implements IBingoMatchService
{

    public function getByBingoGameId(int $gameId): BingoMatchResponseDTO
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        $pos = $this->getCurrentGameMatchPosition($bingoGame);
        $nextPos = $pos + 1;
        $bingoMatch = BingoMatch::query()
            ->with('player')
            ->where('bingo_game_id', $gameId)
            ->where('pos', $nextPos)
            ->firstOrFail();
        if (!$bingoMatch) abort(400, "Invalid Request");
        $bingoGame->update([
            "remaining_answers" => $bingoGame->remaining_answers - 1
        ]);
        return BingoMatchResponseDTO::fromModel($bingoMatch);
    }

    public function getBingoGameCurrentMatch(int $gameId): BingoMatch
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        $pos = $this->getCurrentGameMatchPosition($bingoGame);
        $bingoMatch = BingoMatch::query()
            ->where('bingo_game_id', $gameId)
            ->where('pos', $pos)
            ->firstOrFail();
        return $bingoMatch;
    }

    private function getCurrentGameMatchPosition(BingoGame $bingoGame): int
    {
        $remaining_answers = $bingoGame->remaining_answers + 1 ?? 0;
        $totalAnswers = $bingoGame->matches()->count();
        $pos = $totalAnswers - $remaining_answers;
        return $pos;
    }
}
