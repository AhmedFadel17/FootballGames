<?php

namespace App\Services\GamesListServices\GuessThePlayer;

use App\DTOs\Game\GameResult\GameResultDTO;
use App\DTOs\GamesList\GuessThePlayer\CreateGuessThePlayerGameDto;
use App\DTOs\GamesList\GuessThePlayer\JoinGuessThePlayerGameDto;
use App\Events\GameActionEvent;
use App\Events\GameFinishedEvent;
use App\Events\GameStartedEvent;
use App\Models\Core\Player;
use App\Models\Game\Game;
use App\Models\Game\GameEntry;
use App\Models\Game\GameInstance;
use App\Models\Game\GameResult;
use App\Models\GamesList\GuessThePlayer\GuessThePlayerGame;
use App\Models\GamesList\GuessThePlayer\GuessThePlayerGameAssignment;
use App\Models\User;
use App\Resources\GamesList\GuessThePlayerRescource;
use App\Services\GameServices\GameResult\IGameResultService;
use App\Shared\Enums\GameResultStatus;
use App\Shared\Enums\GameStatus;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GuessThePlayerGameService implements IGuessThePlayerGameService
{

    const SLUG = 'guess-the-player';
    public function __construct(private IGameResultService $gameResultService) {}

    public function create(User $user, CreateGuessThePlayerGameDto $dto): GuessThePlayerRescource
    {
        return DB::transaction(function () use ($user, $dto) {
            $game = Game::where('slug', self::SLUG)->firstOrFail();
            $code = $this->generateUniqueRoomCode();
            $gameInstance = GameInstance::create([
                'game_id' => $game->id,
                'status' => GameStatus::PENDING,
                'creator_id' => $user->id,
                'room_code' => $code,
                'max_players' => $dto->playerCount,
                'start_at' => now()
            ]);
            GameEntry::create([
                'game_instance_id' => $gameInstance->id,
                'user_id' => $user->id,
            ]);
            $guessThePlayerGame = GuessThePlayerGame::create([
                'game_instance_id' => $gameInstance->id,
                'players_count' => $dto->playerCount,
            ]);
            $guessThePlayerGame->load(['instance.entries.user']);
            return GuessThePlayerRescource::make($guessThePlayerGame);
        });
    }

    public function join(User $user): GuessThePlayerRescource
    {
        $availableInstance = GameInstance::whereHas('game', fn($q) => $q->where('slug', self::SLUG))
            ->where('status', GameStatus::PENDING)
            ->where('created_at', '>=', now()->subMinutes(10))
            ->whereNotNull('room_code')
            ->whereHas('entries', function ($q) {}, '<', DB::raw('max_players'))
            ->first();
        if (!$availableInstance) {
            throw new Exception("No available rooms found. Try creating one!");
        }


        return $this->joinWithCode($user, new JoinGuessThePlayerGameDto($availableInstance->room_code));
    }

    public function joinWithCode(User $user, JoinGuessThePlayerGameDto $dto): GuessThePlayerRescource
    {
        return DB::transaction(function () use ($user, $dto) {
            $gameInstance = GameInstance::where('room_code', strtoupper($dto->code))
                ->lockForUpdate()
                ->firstOrFail();
            if ($gameInstance->entries()->count() >= $gameInstance->max_players) {
                throw new Exception("Room is full.");
            }
            if ($gameInstance->status !== GameStatus::PENDING) {
                throw new Exception("Game has already started.");
            }

            $entry = GameEntry::firstOrCreate([
                'game_instance_id' => $gameInstance->id,
                'user_id' => $user->id,
            ]);
            $currentPlayersCount = $gameInstance->entries()->count();

            if ($currentPlayersCount >= $gameInstance->max_players) {
                $this->start($gameInstance->id);
            }

            $guessThePlayerGame = GuessThePlayerGame::where('game_instance_id', $gameInstance->id)->firstOrFail();
            $guessThePlayerGame->load(['instance.entries.user']);
            return GuessThePlayerRescource::make($guessThePlayerGame);
        });
    }

    public function start($instanceId)
    {
        $instance = GameInstance::findOrFail($instanceId);
        $guessThePlayerGame = GuessThePlayerGame::where('game_instance_id', $instance->id)->firstOrFail();
        $entries = $instance->entries;
        foreach ($entries as $e) {
            $randomPlayer = Player::where('popularity', '>', 70)->inRandomOrder()->first();
            GuessThePlayerGameAssignment::create([
                'game_entry_id' => $e->id,
                'guess_the_player_game_id' => $guessThePlayerGame->id,
                'target_player_id' => $randomPlayer->id
            ]);
        }
        $instance->update(['status' => GameStatus::ACTIVE]);
        // event(new GameStartedEvent($instance->id));
        broadcast(new GameStartedEvent($instance->id));
    }

    public function getByInstanceId(User $user, $instanceId): GuessThePlayerRescource
    {
        $instance = GameInstance::findOrFail($instanceId);
        $guessThePlayerGame = GuessThePlayerGame::where('game_instance_id', $instance->id)->firstOrFail();
        return GuessThePlayerRescource::make($guessThePlayerGame->load(['instance.entries.user', 'assignments.entry.user', 'assignments.player.country']));
    }
    public function getById(User $user, $id): GuessThePlayerRescource
    {
        $guessThePlayerGame = GuessThePlayerGame::findOrFail($id);
        return GuessThePlayerRescource::make($guessThePlayerGame->load(['instance.entries.user', 'assignments.entry.user', 'assignments.player.country']));
    }

    public function submitAnswer(User $user, $assignmentId, $answerId): bool
    {
        $assignment = GuessThePlayerGameAssignment::with('player')->findOrFail($assignmentId);
        $game = $assignment->game;
        $instance = $game->instance;
        if ($instance->status !== GameStatus::ACTIVE) {
            abort(400, "Game is not active");
        }
        $currentEntry = $instance->entries->where('user_id', $user->id)->first();

        if (!$currentEntry) {
            abort(403, "You are not a participant in this game");
        }
        if ($assignment->target_player_id === $answerId) {
            $assignment->update(['is_solved' => true, 'solved_at' => now()]);
            broadcast(new GameActionEvent(
                $assignment->game->game_instance_id,
                'assignment.solved',
                ['assignment' => $assignment->load('player')]
            ));

            $resultsCount = $this->gameResultService->getGameResultsCount($instance->id);
            $currentRank = $resultsCount + 1;
            $result = $this->gameResultService->create(new GameResultDTO([
                'game_entry_id' => $currentEntry->id,
                'score' => $this->calculateScore($currentRank, $instance->max_players),
                'is_winner' => ($currentRank === 1),
                'rank' => $currentRank,
                'status' => ($currentRank === 1) ? GameResultStatus::WON : GameResultStatus::LOST
            ]));

            if (($resultsCount + 1) == ($instance->entries->count() - 1)) {
                $this->finalizeGame($instance, $currentRank + 1);
            }
            return true;
        } else {
            abort(400, "wrong answer");
        }
    }

    protected function finalizeGame($instance, $finalRank)
    {
        $lastEntry = $instance->entries()->whereDoesntHave('result')->first();
        if ($lastEntry) {
            $lastResult = $this->gameResultService->create(new GameResultDTO([
                'game_entry_id' => $lastEntry->id,
                'score' => 0,
                'is_winner' => false,
                'rank' => $finalRank,
                'status' => GameResultStatus::LOST
            ]));
        }
        $instance->update(['status' => GameStatus::FINISHED]);
        broadcast(new GameFinishedEvent($instance->id));
    }
    private function generateUniqueRoomCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (GameInstance::where('room_code', $code)->exists());

        return $code;
    }

    private function calculateScore($rank, $totalPlayers)
    {
        if ($totalPlayers == 0 || $rank > $totalPlayers) return 0;
        if ($totalPlayers <= 1) return 1000;
        $score = 1000 * ($totalPlayers - $rank) / ($totalPlayers - 1);
        return (int) $score;
    }
}
