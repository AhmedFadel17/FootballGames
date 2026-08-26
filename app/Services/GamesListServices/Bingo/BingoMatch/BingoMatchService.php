<?php

namespace App\Services\GamesListServices\Bingo\BingoMatch;

use App\Enums\GameEngine\GameDifficulty;
use App\Models\Core\Player;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;


class BingoMatchService implements IBingoMatchService
{

    public function createGameMatches(BingoGame $game, int $answersCount): void
    {
        $difficulty = $game->difficulty;
        $minPop = $difficulty->minPopularity(Player::class);
        $players = Player::inRandomOrder()->where('popularity', '>=', $minPop)->limit($answersCount)->get();

        $matches = [];
        foreach ($players as $index => $player) {
            $matches[] = [
                'bingo_game_id' => $game->id,
                'player_id' => $player->id,
                'pos' => $index,
            ];
        }

        BingoMatch::insert($matches);
    }

    public function getCurrentMatch(BingoGame $game): BingoMatch
    {
        $pos = $this->calculateMatchPosition($game);

        return BingoMatch::where('bingo_game_id', $game->id)
            ->where('pos', $pos)
            ->firstOrFail();
    }

    public function getNextMatch(BingoGame $game): BingoMatch
    {
        $nextPos = $this->calculateMatchPosition($game) + 1;

        return BingoMatch::with('player')
            ->where('bingo_game_id', $game->id)
            ->where('pos', $nextPos)
            ->firstOrFail();
    }

    private function calculateMatchPosition(BingoGame $game): int
    {
        $totalAnswers = $game->matches()->count();
        $remaining = $game->remaining_answers + 1;

        return $totalAnswers - $remaining;
    }
}
