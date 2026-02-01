<?php

namespace App\Services\GamesListServices\GuessThePlayer;

use App\DTOs\GamesList\GuessThePlayer\CreateGuessThePlayerGameDto;
use App\DTOs\GamesList\GuessThePlayer\JoinGuessThePlayerGameDto;
use App\Events\GameActionEvent;
use App\Events\GameStartedEvent;
use App\Models\Core\Player;
use App\Models\Game\Game;
use App\Models\Game\GameEntry;
use App\Models\Game\GameInstance;
use App\Models\GamesList\GuessThePlayer\GuessThePlayerGame;
use App\Models\GamesList\GuessThePlayer\GuessThePlayerGameAssignment;
use App\Models\User;
use App\Resources\GamesList\GuessThePlayerRescource;
use App\Shared\Enums\GameStatus;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GuessThePlayerGameService implements IGuessThePlayerGameService
{

    const SLUG = 'guess-the-player';

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
        if ($assignment->game->instance->status !== GameStatus::ACTIVE) {
            abort(400, "Game is not active");
        }
        if ($assignment->target_player_id === $answerId) {
            $assignment->update(['is_solved' => true, 'solved_at' => now()]);
            broadcast(new GameActionEvent(
                $assignment->game->game_instance_id,
                'assignment.solved',
                ['assignment' => $assignment->load('player')]
            ));
            return true;
        } else {
            broadcast(new GameStartedEvent($assignment->game->game_instance_id));

            abort(400, "wrong answer");
        }
    }
    private function generateUniqueRoomCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (GameInstance::where('room_code', $code)->exists());

        return $code;
    }
}
