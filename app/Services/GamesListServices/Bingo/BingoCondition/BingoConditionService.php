<?php

namespace App\Services\GamesListServices\Bingo\BingoCondition;

use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GamesList\BingoConnectionType;
use App\Models\Core\Country;
use App\Models\Core\Player;
use App\Models\Core\PlayerTeamPeriod;
use App\Models\Core\Team;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;
use App\Resources\GamesList\Bingo\BingoConditionResource;
use App\Enums\GameEngine\GameStatus;
use DB;

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
            ->orderBy('pos', 'asc')
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

    public function createGameConditions(BingoGame $game, GameDifficulty $difficulty): void
    {
        $size = $game->size;
        $minPlayersPop = $difficulty->minPopularity(Player::class);
        $minTeamsPop = $difficulty->minPopularity(Team::class);
        $minCountriesPop = $difficulty->minPopularity(Country::class);

        $players = Player::inRandomOrder()->where('popularity', '>=', $minPlayersPop)->limit($size * 3)->get();
        $teams = Team::inRandomOrder()->where('popularity', '>=', $minTeamsPop)->limit($size * 3)->get();
        $countries = Country::inRandomOrder()->where('popularity', '>=', $minCountriesPop)->limit($size * 3)->get();

        $items = collect()
            ->merge($players->map(fn($p) => ['type' => Player::class, 'con' => BingoConnectionType::PLAYED_WITH, 'id' => $p->id]))
            ->merge($teams->map(fn($t) => ['type' => Team::class, 'con' => BingoConnectionType::PLAYED_FOR, 'id' => $t->id]))
            ->merge($countries->map(fn($c) => ['type' => Country::class, 'con' => BingoConnectionType::FROM, 'id' => $c->id]))
            ->shuffle()
            ->take($size * $size);

        $conditions = [];
        foreach ($items as $index => $item) {
            $conditions[] = [
                'bingo_game_id' => $game->id,
                'object_type' => $item['type'],
                'object_id' => $item['id'],
                'connection_type' => $item['con'],
                'pos' => $index,
            ];
        }

        BingoCondition::insert($conditions);
    }

    public function validateMatchAgainstCondition(BingoCondition $condition, BingoMatch $match): bool
    {
        $object = $condition->objectable;
        $player = $match->player;

        if (!$object || !$player) {
            return false;
        }

        return match ($condition->object_type) {
            Player::class => $player->id !== $object->id && DB::table('player_team_periods as pt1')
                ->join('player_team_periods as pt2', function ($join) use ($object, $player) {
                        $join->on('pt1.team_id', '=', 'pt2.team_id')
                        ->where('pt1.player_id', $object->id)
                        ->where('pt2.player_id', $player->id)
                        ->whereRaw('pt1.start_date <= pt2.end_date')
                        ->whereRaw('pt2.start_date <= pt1.end_date');
                    })->exists(),

            Team::class => PlayerTeamPeriod::query()
                ->where('player_id', $player->id)
                ->where('team_id', $object->id)
                ->exists(),

            Country::class => $player->country_id === $object->id,

            default => false,
        };
    }
}
