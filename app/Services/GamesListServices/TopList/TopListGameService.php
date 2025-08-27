<?php

namespace App\Services\GamesListServices\TopList;

use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\GamesList\TopList\TopListGameResponseDTO;
use App\DTOs\GamesList\TopList\TopListItemResponseDTO;
use App\Models\Game\GameEntry;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TopListGameService implements ITopListGameService
{

    public function getAll(): array
    {
        return TopListGame::all()->toArray();
    }

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

    public function startGame(User $user, int $gameId): TopListGameResponseDTO
    {
        $game = TopListGame::query()->findOrFail($gameId);
        $gameInstance = $game->instance;
        $gameEntry = GameEntry::firstOrCreate([
            'game_instance_id' => $gameInstance->id,
            'user_id' => $user->id,
        ]);
        return TopListGameResponseDTO::fromModel($game);
    }


    public function cancelGame(User $user, int $gameId): void
    {
        $game = TopListGame::query()->findOrFail($gameId);
        // $this->finishGame($user, $bingoGame, GameStatus::CANCELLED);
    }

    public function check(User $user, int $gameId, int $objectId): TopListItemResponseDTO
    {
        $game = TopListGame::query()->findOrFail($gameId);
        $item = $game->items()->with('game')->where('object_id', $objectId)->firstOrFail();
        return TopListItemResponseDTO::fromModel($item);
    }
}
