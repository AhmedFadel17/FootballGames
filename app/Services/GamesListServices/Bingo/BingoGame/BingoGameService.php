<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;

use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionResponseDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Player;
use App\Models\Core\PlayerTeamPeriod;
use App\Models\Core\Team;
use App\Models\Game\GameInstance;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;
use App\Services\Pagination\IPaginationService;
use App\Shared\Enums\BingoConnectionType;
use Illuminate\Support\Facades\DB;

class BingoGameService implements IBingoGameService
{
    private readonly IPaginationService $_paginationService;
    const ANSWERS_SIZE = 40;
    public function __construct(IPaginationService $paginationService)
    {
        $this->_paginationService = $paginationService;
    }

    public function skip(int $gameId): void
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        $remaining_answers = $bingoGame->remaining_answers ?? 0;
        if ($remaining_answers == 0) abort(400, "Invalid Request");
        $bingoGame->update([
            "remaining_answers" => $remaining_answers - 1
        ]);
        $remaining_answers = $bingoGame->remaining_answers ?? 0;
    }
    public function check(int $gameId, int $conditionPos): BingoConditionResponseDTO
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        $remaining_answers = $bingoGame->remaining_answers ?? 0;

        if ($remaining_answers <= 0) {
            abort(400, "Invalid Request");
        }

        // 🔹 إجمالي الماتشات
        $totalAnswers = BingoMatch::query()
            ->where('bingo_game_id', $gameId)
            ->count();

        $pos = max(0, $totalAnswers - $remaining_answers);

        $bingoCondition = BingoCondition::query()
            ->where('bingo_game_id', $gameId)
            ->where('pos', $conditionPos)
            ->firstOrFail();

        $bingoMatch = BingoMatch::query()
            ->where('bingo_game_id', $gameId)
            ->where('pos', $pos)
            ->firstOrFail();

        $object = $bingoCondition->objectable;
        $player = $bingoMatch->player;

        $acceptedAnswer = false;

        if ($object && $player) {
            // ✅ تحقق لو object = Player
            if ($bingoCondition->object_type === Player::class) {
                $sharedTeam = DB::table('player_team_periods as pt1')
                    ->join('player_team_periods as pt2', function ($join) use ($object, $player) {
                        $join->on('pt1.team_id', '=', 'pt2.team_id')
                            ->where('pt1.player_id', $object->id)
                            ->where('pt2.player_id', $player->id)
                            ->whereRaw('pt1.start_date <= pt2.end_date')
                            ->whereRaw('pt2.start_date <= pt1.end_date');
                    })
                    ->exists();

                if ($sharedTeam) {
                    $acceptedAnswer = true;
                }
            }

            // ✅ تحقق لو object = Team
            if ($bingoCondition->object_type === Team::class) {
                $playedForTeam = PlayerTeamPeriod::query()
                    ->where('player_id', $player->id)
                    ->where('team_id', $object->id)
                    ->exists();

                if ($playedForTeam) {
                    $acceptedAnswer = true;
                }
            }
        }

        if ($acceptedAnswer) {
            $bingoCondition->update([
                'bingo_match_id' => $bingoMatch->id,
                'is_marked' => true,
            ]);
        }

        $bingoGame->update([
            'remaining_answers' => $remaining_answers - 1,
        ]);

        return BingoConditionResponseDTO::fromModel($bingoCondition->refresh());
    }


    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO
    {
        $query = BingoGame::query();

        $allowedFilters = ['game_instance_id'];
        $searchableFields = [];

        return $this->_paginationService->paginate($query, $paginationDTO, BingoGameResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById(int $id): BingoGameResponseDTO
    {
        $bingoGame = BingoGame::findOrFail($id);
        return BingoGameResponseDTO::fromModel($bingoGame);
    }

    public function create(int $game_id, int $size, User $user): BingoGameResponseDTO
    {
        $gameInstance = GameInstance::create([
            'game_id' => $game_id,
            'start_at' => now()
        ]);
        $bingoGame = BingoGame::create([
            'game_instance_id' => $gameInstance->id,
            'size' => $size,
            'remaining_answers' => $this::ANSWERS_SIZE
        ]);

        $players = Player::inRandomOrder()->limit($size * 3)->get();
        $teams = Team::inRandomOrder()->limit($size * 3)->get();
        $items = collect()
            ->merge($players->map(fn($p) => ['type' => Player::class, 'con' => BingoConnectionType::PLAYED_WITH, 'id' => $p->id, 'name' => $p->name]))
            ->merge($teams->map(fn($t) => ['type' => Team::class, 'con' => BingoConnectionType::PLAYED_FOR, 'id' => $t->id, 'name' => $t->name]))
            ->shuffle()
            ->take($size * $size);

        $bingoConditionsArr = [];
        foreach ($items as $index => $item) {
            $bingoConditionsArr[] = [
                'bingo_game_id' => $bingoGame->id,
                'object_type' => $item['type'],
                'object_id' => $item['id'],
                'connection_type' => $item['con'],
                'pos' => $index
            ];
        }
        BingoCondition::insert($bingoConditionsArr);
        $playersToMatch = Player::inRandomOrder()->limit($this::ANSWERS_SIZE)->get();
        $bingoMatchesArr = [];
        foreach ($playersToMatch as $idx => $player) {
            $bingoMatchesArr[] = [
                'bingo_game_id' => $bingoGame->id,
                'player_id' => $player->id,
                'pos' => $idx,
            ];
        }
        BingoMatch::insert($bingoMatchesArr);
        $bingoGame->load(['conditions']);
        return BingoGameResponseDTO::fromModel($bingoGame);
    }

    public function update(int $id, BingoGameDTO $dto): BingoGameResponseDTO
    {
        $bingoGame = BingoGame::findOrFail($id);
        $bingoGame->update($dto->toArray());
        return BingoGameResponseDTO::fromModel($bingoGame);
    }

    public function delete(int $id): void
    {
        $bingoGame = BingoGame::findOrFail($id);
        $bingoGame->delete();
    }
}
