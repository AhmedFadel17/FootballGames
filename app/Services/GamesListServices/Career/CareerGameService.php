<?php

namespace App\Services\GamesListServices\Career;

use App\DTOs\GamesList\CareerGameDTO;
use App\Enums\Core\TeamType;
use App\Models\Core\Player;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameInstance;
use App\Models\GameEngine\GameResult;
use App\Models\GamesList\Career\CareerGame;
use App\Models\User;
use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GameEngine\GameStatus;
use App\Enums\GameEngine\GameResultStatus;
use Illuminate\Support\Facades\DB;

class CareerGameService implements ICareerGameService
{
    public const SLUG = 'player-career';
    public const BASE_SCORE = 100;
    public const PENALTY_PER_REVEAL = 15;

    public function getById(User $user, int $careerGameId): CareerGame
    {
        return CareerGame::where('id', $careerGameId)->where('game_instance_id', $careerGameId)->firstOrFail();
    }

    public function create(User $user, CareerGameDTO $dto): CareerGame
    {
        return DB::transaction(function () use ($user, $dto) {
            $game = Game::where('slug', self::SLUG)->firstOrFail();
            $difficulty = GameDifficulty::tryFrom($dto->difficulty) ?? GameDifficulty::EASY;
            $minPopularity = $difficulty->minPopularity(Player::class);

            // Define relationship condition for team with type = 1
            $type1TeamsFilter = fn($query) => $query->whereHas('team', fn($q) => $q->where('type', TeamType::CLUB));

            $player = Player::where('popularity', '>=', $minPopularity)
                ->whereHas('teamPeriods', $type1TeamsFilter, '>=', 3)
                ->inRandomOrder()
                ->firstOrFail();

            $totalSteps = $player->teamPeriods()
                ->whereHas('team', fn($q) => $q->where('type', TeamType::CLUB))
                ->count();

            $gameInstance = GameInstance::create([
                'game_id' => $game->id,
                'status' => GameStatus::ACTIVE,
                'start_at' => now(),
            ]);

            GameEntry::create([
                'game_instance_id' => $gameInstance->id,
                'user_id' => $user->id,
            ]);

            return CareerGame::create([
                'game_instance_id' => $gameInstance->id,
                'player_id' => $player->id,
                'order_type' => rand(0, 1) ? 'CHRONOLOGICAL' : 'REVERSE',
                'total_steps' => $totalSteps,
                'difficulty' => $difficulty,
                'revealed_steps' => 1,
                'attempts_left' => 3,
            ]);
        });
    }

    public function revealNextStep(User $user, int $careerGameId): CareerGame
    {
        $careerGame = CareerGame::findOrFail($careerGameId);

        if ($careerGame->revealed_steps >= $careerGame->total_steps) {
            abort(400, 'All cards are already revealed');
        }

        $careerGame->increment('revealed_steps');
        return $careerGame;
    }

    public function guess(User $user, int $careerGameId, int $guessedPlayerId): array
    {
        $careerGame = CareerGame::findOrFail($careerGameId);
        $isCorrect = ($careerGame->player_id === $guessedPlayerId);

        if ($isCorrect) {
            $scoreData = $this->calculateScore($careerGame->total_steps, $careerGame->revealed_steps);
            $this->finishGame($user, $careerGame, true, $scoreData['total_score']);

            return [
                'correct' => true,
                'score' => $scoreData['total_score'],
                'base_score' => $scoreData['base_score'],
                'bonus' => $scoreData['bonus'],
                'player' => $careerGame->player,
            ];
        }

        $careerGame->decrement('attempts_left');

        if ($careerGame->attempts_left <= 0) {
            $this->finishGame($user, $careerGame, false, 0);
        }

        return [
            'correct' => false,
            'attempts_left' => $careerGame->attempts_left,
        ];
    }

    private function calculateScore(int $totalSteps, int $revealedSteps): array
    {
        $baseScore = max(10, self::BASE_SCORE - (($revealedSteps - 1) * self::PENALTY_PER_REVEAL));

        $bonus = 0;
        if ($revealedSteps === 1) {
            $bonus = 50;
        } elseif ($revealedSteps === 2) {
            $bonus = 25;
        }

        return [
            'base_score' => $baseScore,
            'bonus' => $bonus,
            'total_score' => $baseScore + $bonus,
        ];
    }

    private function finishGame(User $user, CareerGame $game, bool $isWon, int $score): void
    {
        $game->instance->update([
            'status' => GameStatus::FINISHED,
            'end_at' => now(),
        ]);

        $gameEntry = GameEntry::where('user_id', $user->id)
            ->where('game_instance_id', $game->instance->id)
            ->firstOrFail();

        GameResult::create([
            'game_entry_id' => $gameEntry->id,
            'status' => $isWon ? GameResultStatus::WON : GameResultStatus::LOST,
            'score' => $score,
            'is_winner' => $isWon,
        ]);
    }
}
