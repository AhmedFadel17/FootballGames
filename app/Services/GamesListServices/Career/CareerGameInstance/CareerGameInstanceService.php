<?php

namespace App\Services\GamesListServices\Career\CareerGameInstance;

use App\DTOs\GamesList\Career\CareerGameDTO;
use App\DTOs\GamesList\Career\CareerGameInstanceDTO;
use App\Enums\Core\TeamType;
use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GameEngine\GameStatus;
use App\Models\Core\Player;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameInstance;
use App\Models\GamesList\Career\CareerGame;
use App\Models\GamesList\Career\CareerGameInstance;
use App\Models\User;
use App\Services\GameEngine\GameInstances\IGameInstanceService;
use App\Services\GamesListServices\Career\CareerGame\ICareerGameService;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Log;
class CareerGameInstanceService implements ICareerGameInstanceService
{
    public const SLUG = 'player-career';
    public const BASE_SCORE = 100;
    public const PENALTY_PER_REVEAL = 15;

    public function __construct(
        private readonly IGameInstanceService $gameInstanceService,
        private readonly ICareerGameService $careerGameService,
    ) {
    }

    public function getById(User $user, int $careerGameInstanceId): CareerGameInstance
    {
        return CareerGameInstance::with([
            'careerGame.player'
        ])->findOrFail($careerGameInstanceId);
    }

    public function startGame(User $user, CareerGameInstanceDTO $dto): CareerGameInstance
    {
        return DB::transaction(function () use ($user, $dto) {
            $game = Game::where('slug', self::SLUG)->firstOrFail();
            $difficulty = GameDifficulty::tryFrom($dto->difficulty) ?? GameDifficulty::EASY;

            $careerGame = $this->careerGameService->getRandom($user, $difficulty);
            if ($careerGame === null) {
                $careerGame = $this->careerGameService->create(new CareerGameDTO(
                    difficulty: $dto->difficulty,
                ));
            }

            [$gameInstance, $gameEntry] = $this->gameInstanceService->startSession($user, $game);

            return CareerGameInstance::create([
                'game_instance_id' => $gameInstance->id,
                'career_game_id' => $careerGame->id,
                'revealed_steps' => 1,
                'attempts_left' => 3,
            ]);
        });
    }

    public function revealNextStep(User $user, int $careerGameInstanceId): CareerGameInstance
    {
        $careerGame = CareerGameInstance::findOrFail($careerGameInstanceId);

        if ($careerGame->revealed_steps >= $careerGame->careerGame->total_steps) {
            throw new HttpException(400, 'All cards are already revealed.');
        }

        $careerGame->increment('revealed_steps');
        return $careerGame->fresh();
    }

    public function guess(User $user, int $careerGameInstanceId, int $guessedPlayerId): array
    {
        return DB::transaction(function () use ($user, $careerGameInstanceId, $guessedPlayerId) {
            $careerGame = CareerGameInstance::with(['gameInstance.entries', 'careerGame.player'])->findOrFail($careerGameInstanceId);
            $gameInstance = $careerGame->gameInstance;

            if ($gameInstance->status === GameStatus::FINISHED) {
                throw new HttpException(400, "Game session is already finished.");
            }

            $gameEntry = $gameInstance->entries->where('user_id', $user->id)->first();
            if ($gameEntry === null) {
                throw new HttpException(404, "Game entry not found.");
            }

            $isCorrect = ($careerGame->careerGame->player_id === $guessedPlayerId);

            if ($isCorrect) {
                $scoreData = $this->calculateScore($careerGame->careerGame->total_steps, $careerGame->revealed_steps);

                $this->finishGame(
                    gameInstance: $gameInstance,
                    gameEntry: $gameEntry,
                    careerGame: $careerGame->careerGame,
                    isWon: true,
                    score: $scoreData['total_score']
                );

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
                $this->finishGame(
                    gameInstance: $gameInstance,
                    gameEntry: $gameEntry,
                    careerGame: $careerGame->careerGame,
                    isWon: false,
                    score: 0
                );
            }

            return [
                'correct' => false,
                'attempts_left' => $careerGame->attempts_left,
            ];
        });
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

    private function finishGame(
        GameInstance $gameInstance,
        GameEntry $gameEntry,
        CareerGame $careerGame,
        bool $isWon,
        int $score
    ): void {
        $now = now();
        $durationSeconds = (int) $now->diffInSeconds($gameInstance->start_at);

        // Pass calculated metrics to GameInstanceService to store results and update player progress/XP
        $this->gameInstanceService->finishSession(
            gameInstance: $gameInstance,
            gameEntry: $gameEntry,
            isWon: $isWon,
            correctCount: $isWon ? $careerGame->total_steps : 0,
            totalItems: $careerGame->total_steps,
            durationSeconds: $durationSeconds,
            difficulty: $careerGame->difficulty,
            calculatedScore: $score
        );
    }
}