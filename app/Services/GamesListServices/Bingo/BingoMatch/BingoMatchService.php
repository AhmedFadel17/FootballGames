<?php

namespace App\Services\GamesListServices\Bingo\BingoMatch;

use App\Enums\GameEngine\GameDifficulty;
use App\Models\Core\Player;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoGameInstance;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Services\Core\Players\IPlayerService;
use Symfony\Component\HttpKernel\Exception\HttpException;


class BingoMatchService implements IBingoMatchService
{

    public function __construct(private readonly IPlayerService $playerService)
    {
    }

    public function createGameMatches(BingoGame $game, int $answersCount): void
    {
        $difficulty = $game->difficulty;
        $minPop = $difficulty->minPopularity(Player::class);
        $players = $this->playerService->getRandom($minPop, false, $answersCount);

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

    public function getCurrentMatch(BingoGameInstance $bingoGameInstance): ?BingoMatch
    {
        $pos = $bingoGameInstance->current_match_pos;
        $game = $bingoGameInstance->bingoGame;
        return $game->matches()->with('player')
            ->where('pos', $pos)
            ->first();
    }

    public function getNextMatch(BingoGameInstance $bingoGameInstance): ?BingoMatch
    {
        $nextPos = $bingoGameInstance->current_match_pos + 1;
        $game = $bingoGameInstance->bingoGame;
        return $game->matches()->with('player')
            ->where('pos', $nextPos)
            ->first();
    }
}
