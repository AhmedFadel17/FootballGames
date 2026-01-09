<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;

use App\DTOs\Game\GameResult\GameResultResponseDTO;
use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionResponseDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\GamesList\Bingo\BingoGame\BingoGameResponseDTO;
use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Country;
use App\Models\Core\Player;
use App\Models\Core\PlayerTeamPeriod;
use App\Models\Core\Team;
use App\Models\Game\Game;
use App\Models\Game\GameEntry;
use App\Models\Game\GameInstance;
use App\Models\Game\GameResult;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;
use App\Services\GamesListServices\Bingo\BingoCondition\IBingoConditionService;
use App\Services\GamesListServices\Bingo\BingoMatch\IBingoMatchService;
use App\Services\Pagination\IPaginationService;
use App\Shared\Enums\BingoConnectionType;
use App\Shared\Enums\GameDifficulty;
use App\Shared\Enums\GameEntryStatus;
use App\Shared\Enums\GameResultStatus;
use App\Shared\Enums\GameStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BingoGameService implements IBingoGameService
{


    const ANSWERS_SIZE = 40;
    const SLUG='bingo-football';
    public function __construct(
        private readonly IPaginationService $_paginationService,
        private readonly IBingoMatchService $_matcherService,
        private readonly IBingoConditionService $_conditionService
    ) {}


    public function check(User $user, int $gameId, int $conditionPos): BingoConditionResponseDTO
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        if ($bingoGame->instance->status !== GameStatus::ACTIVE) abort(400, "Game is not Active");
        $isFinished = $this->checkGameFinished($bingoGame);
        if ($isFinished) {
            $this->finishGame($user, $bingoGame);
            abort(400, "Game is finished");
        }
        $bingoCondition = $this->_conditionService::getByBingoGameIdAndPosition($bingoGame->id, $conditionPos);

        $bingoMatch = $this->getBingoGameCurrentMatch($bingoGame->id);

        $object = $bingoCondition->objectable;
        $player = $bingoMatch->player;

        $acceptedAnswer = false;

        if ($object && $player) {
            switch ($bingoCondition->object_type) {
                case Player::class:
                    if ($player->id === $object->id) {
                        break;
                    }
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
                    break;
                case Team::class:
                    $playedForTeam = PlayerTeamPeriod::query()
                        ->where('player_id', $player->id)
                        ->where('team_id', $object->id)
                        ->exists();

                    if ($playedForTeam) {
                        $acceptedAnswer = true;
                    }
                    break;
                case Country::class:
                    if ($player->country_id === $object->id) {
                        $acceptedAnswer = true;
                    }
                    break;
            }
        }

        if ($acceptedAnswer) {
            $bingoCondition->update([
                'bingo_match_id' => $bingoMatch->id,
                'is_marked' => true,
            ]);
            $bingoCondition->refresh();
            $bingoCondition->load(['match.player']);
        } else {
            $this->updateRemainingAnswers($bingoGame, $bingoGame->remaining_answers - 1);
        }
        $isFinished = $this->checkGameFinished($bingoGame);

        if ($isFinished) {
            $this->finishGame($user, $bingoGame);
        }

        return BingoConditionResponseDTO::fromModel($bingoCondition);
    }

    public function cancelGame(User $user, int $gameId): void
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        $this->finishGame($user, $bingoGame, GameStatus::CANCELLED);
    }

    public function create(User $user, int $size, string $difficulty): BingoGameResponseDTO
    {
        $game=Game::where('slug',$this::SLUG)->firstOr();
        $game_id=$game->id;
        $gameInstance = GameInstance::create([
            'game_id' => $game_id,
            'status' => GameStatus::ACTIVE,
            'start_at' => now()
        ]);

        GameEntry::create([
            'game_instance_id' => $gameInstance->id,
            'user_id' => $user->id,
        ]);
        $bingoGame = BingoGame::create([
            'game_instance_id' => $gameInstance->id,
            'size' => $size,
            'remaining_answers' => $this::ANSWERS_SIZE
        ]);
        $difficulty = GameDifficulty::tryFrom($difficulty);

        $minPlayersPopularity = $this->getMinPopularityByDifficulty($difficulty, Player::class);

        $minTeamsPopularity = $this->getMinPopularityByDifficulty($difficulty, Team::class);
        $minCountriesPopularity = $this->getMinPopularityByDifficulty($difficulty, Country::class);

        $players = Player::inRandomOrder()->where('popularity', '>=', $minPlayersPopularity)->limit($size * 3)->get();
        $teams = Team::inRandomOrder()->where('popularity', '>=', $minTeamsPopularity)->limit($size * 3)->get();
        $countries = Country::inRandomOrder()->where('popularity', '>=', $minCountriesPopularity)->limit($size * 3)->get();
        $items = collect()
            ->merge($players->map(fn($p) => ['type' => Player::class, 'con' => BingoConnectionType::PLAYED_WITH, 'id' => $p->id, 'name' => $p->name]))
            ->merge($teams->map(fn($t) => ['type' => Team::class, 'con' => BingoConnectionType::PLAYED_FOR, 'id' => $t->id, 'name' => $t->name]))
            ->merge($countries->map(fn($t) => ['type' => Country::class, 'con' => BingoConnectionType::FROM, 'id' => $t->id, 'name' => $t->name]))
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
        $playersToMatch = Player::inRandomOrder()->where('popularity', '>=', 40)->limit($this::ANSWERS_SIZE)->get();
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

    public function results(User $user, int $gameId): GameResultResponseDTO
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        if ($bingoGame->instance->status !== GameStatus::FINISHED) {
            $isFinished = $this->checkGameFinished($bingoGame);
            if ($isFinished) {
                $this->finishGame($user, $bingoGame);
            } else {
                abort(400, "Game is still Active");
            }
        }

        $gameEntry = GameEntry::where('user_id', $user->id)
            ->where('game_instance_id', $bingoGame->instance->id)
            ->first();

        $result = GameResult::where('game_entry_id', $gameEntry->id)
            ->first();

        if (!$result) {
            abort(400, "Game not found");
        }

        return GameResultResponseDTO::fromModel($result);
    }

    public function nextMatch(User $user, int $gameId): BingoMatchResponseDTO
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        if ($bingoGame->instance->status !== GameStatus::ACTIVE) abort(400, "Game is not Active");
        $isFinished = $this->checkGameFinished($bingoGame);

        if ($isFinished) {
            $this->finishGame($user, $bingoGame);
            abort(400, "Game is finished");
        }

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



    private function finishGame(User $user, BingoGame $game, GameStatus $gameStatus = GameStatus::FINISHED): void
    {
        if ($game->instance->status === GameStatus::FINISHED) abort(400, "Game is already finished");

        $isWon = $this->evaluateBingoResult($game);

        $game->instance->update([
            'status' => $gameStatus->value,
            'end_at' => now()
        ]);

        $status = $isWon ? GameResultStatus::WON : GameResultStatus::LOST;
        $gameEntry = GameEntry::where('user_id', $user->id)
            ->where('game_instance_id', $game->instance->id)
            ->first();
        $score = $this->evaluateBingoScore($game);
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


    private function evaluateBingoScore(BingoGame $bingoGame): int
    {
        $markedCount = $bingoGame->conditions()->where('is_marked', true)->count();
        $size = $bingoGame->size;
        $startAt = $bingoGame->instance->start_at;
        $endAt = $bingoGame->instance->end_at ?? now();
        $completionRate = $markedCount / ($size * $size);
        $preScore = ($completionRate == 1) ? 1000 : (int) round(1000 * pow($completionRate, 3));
        $timeTaken = $endAt->diffInSeconds($startAt);
        $score = ceil(($preScore) - ($timeTaken / 10));
        $score = max(0, (int)$score);
        return $score;
    }


    private function evaluateBingoResult(BingoGame $bingoGame): bool
    {
        $markedCount = $bingoGame->conditions()->where('is_marked', true)->count();
        $size = $bingoGame->size;
        return $markedCount === $size * $size;
    }

    private function checkGameFinished(BingoGame $bingoGame): bool
    {
        $unmarkedCount = $bingoGame->conditions()->where('is_marked', false)->count();
        $isFinished = $bingoGame->remaining_answers <= 0;
        return $isFinished || ($unmarkedCount === 0);
    }
    private function updateRemainingAnswers(BingoGame $game, int $answers): void
    {
        $game->update([
            'remaining_answers' => $answers,
        ]);
    }

    private function getMinPopularityByDifficulty(GameDifficulty $difficulty, string $class): int
    {
        $thresholds = [
            GameDifficulty::EASY->value => [
                Player::class => 60,
                Team::class => 60,
                Country::class => 60,
            ],
            GameDifficulty::NORMAL->value => [
                Player::class => 50,
                Team::class => 50,
                Country::class => 50,
            ],
            GameDifficulty::HARD->value => [
                Player::class => 20,
                Team::class => 20,
                Country::class => 20,
            ],
        ];
        return $thresholds[$difficulty->value][$class] ?? 40;
    }

    private function getCurrentGameMatchPosition(BingoGame $bingoGame): int
    {
        $remaining_answers = $bingoGame->remaining_answers + 1 ?? 0;
        $totalAnswers = $bingoGame->matches()->count();
        $pos = $totalAnswers - $remaining_answers;
        return $pos;
    }

    private function getBingoGameCurrentMatch(int $gameId): BingoMatch
    {
        $bingoGame = BingoGame::query()->findOrFail($gameId);
        $pos = $this->getCurrentGameMatchPosition($bingoGame);
        $bingoMatch = BingoMatch::query()
            ->where('bingo_game_id', $gameId)
            ->where('pos', $pos)
            ->firstOrFail();
        return $bingoMatch;
    }
}
