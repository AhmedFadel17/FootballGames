<?php

namespace App\Services\GamesListServices\TopList;

use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TopListGameService implements ITopListGameService
{
    public function create(TopListGameDTO $dto): TopListGame
    {
        return DB::transaction(function () use ($dto) {
            // Create Top List Game
            $game = TopListGame::create([
                'game_instance_id' => $dto->gameId,
                'title'            => $dto->title,
                'size'             => $dto->size,
                'max_chances'      => $dto->maxChances,
                'items_type'       => $dto->type->value,
            ]);

            // Insert Items
            foreach ($dto->items as $item) {
                TopListItem::create([
                    'top_list_game_id' => $game->id,
                    'pos'              => $item['pos'],
                    'object_id'        => $item['id'],
                ]);
            }

            return $game->load('items');
        });
    }

    public function cancelGame(User $user, int $gameId): void
    {
        $game = TopListGame::query()->findOrFail($gameId);
        // $this->finishGame($user, $bingoGame, GameStatus::CANCELLED);
    }
}
