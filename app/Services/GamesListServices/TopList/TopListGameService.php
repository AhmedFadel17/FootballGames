<?php

namespace App\Services\GamesListServices\TopList;

use App\DTOs\Game\GameResult\GameResultResponseDTO;
use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\GamesList\TopList\TopListGameResponseDTO;
use App\DTOs\GamesList\TopList\TopListItemResponseDTO;
use App\Models\Game\GameEntry;
use App\Models\Game\GameInstance;
use App\Models\Game\GameResult;
use App\Models\GamesList\TopList\TopListAnswer;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListItem;
use App\Models\User;
use App\Shared\Enums\GameResultStatus;
use App\Shared\Enums\GameStatus;
use Illuminate\Support\Facades\DB;

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
                'game_id' => $dto->gameId,
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
        return DB::transaction(function () use ($game, $user) {
            $gameInstance = GameInstance::create([
                'game_id' => $game->game->id,
                'status' => GameStatus::ACTIVE,
                'start_at' => now(),
            ]);
            GameEntry::firstOrCreate([
                'game_instance_id' => $gameInstance->id,
                'user_id' => $user->id,
            ]);
            return TopListGameResponseDTO::fromModel($game);
        });
    }

    public function results(User $user, int $gameId): GameResultResponseDTO
    {
        $game = TopListGame::query()->findOrFail($gameId);
        if ($game->game->instance->status !== GameStatus::FINISHED) {
            $entry = GameEntry::where('game_instance_id', $game->instance->id)->firstOrFail();
            $isFinished = $this->checkGameFinished($game,$entry);
            if ($isFinished) {
                $this->finishGame($user, $game);
            } else {
                abort(400, "Game is still Active");
            }
        }
        $result = GameResult::where('game_entry_id', $entry->id)
            ->firstOrFail();

        return GameResultResponseDTO::fromModel($result);
    }

    public function cancelGame(User $user, int $gameId): void
    {
        $game = TopListGame::query()->findOrFail($gameId);
        $this->finishGame($user, $game, GameStatus::CANCELLED);
    }

    public function check(User $user, int $gameId, int $objectId): TopListItemResponseDTO
    {
        $game = TopListGame::query()->findOrFail($gameId);
        if ($game->game->instance->status !== GameStatus::ACTIVE) abort(400, "Game is not Active");
        $entry = GameEntry::where('game_instance_id', $game->instance->id)->firstOrFail();
        $isFinished = $this->checkGameFinished($game, $entry);
        if ($isFinished) {
            $this->finishGame($user, $game);
            abort(400, "Game is finished");
        }
        $item = $game->items()->with('game')->where('object_id', $objectId)->first();
        if ($item) {
            $answer = TopListAnswer::where('top_list_item_id', $item->id)->first();
            if ($answer) {
                abort("Player Already answered");
            }
        }

        TopListAnswer::create([
            'top_list_item_id' => ($item) ? $item->id : null,
            'game_entry_id' => $entry->id,
        ]);

        if (!$item) {
            abort(400, "Wrong answer!");
        }

        $isFinished = $this->checkGameFinished($game, $entry);

        if ($isFinished) {
            $this->finishGame($user, $game);
        }
        return TopListItemResponseDTO::fromModel($item);
    }

    private function finishGame(User $user, TopListGame $game, GameStatus $gameStatus = GameStatus::FINISHED): void
    {
        if ($game->game->instance->status === GameStatus::FINISHED) abort(400, "Game is already finished");

        $isWon = $this->evaluateGameResult($game, $game->game->entry);

        $game->game->instance->update([
            'status' => $gameStatus->value,
            'end_at' => now()
        ]);

        $status = $isWon ? GameResultStatus::WON : GameResultStatus::LOST;
        $gameEntry = GameEntry::where('user_id', $user->id)
            ->where('game_instance_id', $game->instance->id)
            ->firstOrFail();
        $score = $this->evaluateGameScore($game, $gameEntry);
        GameResult::updateOrCreate(
            [
                'game_entry_id' => $gameEntry->id,
            ],
            [
                'status' => $status->value,
                'score' => $score,
                'is_winner' => $isWon
            ]
        );
    }

    private function evaluateGameResult(TopListGame $game, GameEntry $entry): bool
    {
        $answersCount = TopListAnswer::where('game_entry_id', $entry->id)->whereNotNull('top_list_item_id')->count();
        $size = $game->size;
        return $answersCount === $size;
    }

    private function checkGameFinished(TopListGame $game, GameEntry $entry): bool
    {
        $answers = TopListAnswer::where('game_entry_id', $entry->id);
        $correct = (clone $answers)->whereNotNull('top_list_item_id')->count();
        $wrong   = (clone $answers)->whereNull('top_list_item_id')->count();
        return $wrong >= $game->max_chances || $correct >= $game->size;
    }

    private function evaluateGameScore(TopListGame $game, GameEntry $entry): int
    {
        $answers = TopListAnswer::where('game_entry_id', $entry->id);
        $correct = (clone $answers)->whereNotNull('top_list_item_id')->count();
        $size = $game->size;
        $startAt = $game->game->instance->start_at;
        $endAt = $game->game->instance->end_at ?? now();
        $completionRate = $correct / $size;
        $preScore = ($completionRate == 1) ? 1000 : (int) round(1000 * pow($completionRate, 3));
        $timeTaken = $endAt->diffInSeconds($startAt);
        $score = ceil(($preScore) - ($timeTaken / 10));
        $score = max(0, (int)$score);
        return $score;
    }
}
