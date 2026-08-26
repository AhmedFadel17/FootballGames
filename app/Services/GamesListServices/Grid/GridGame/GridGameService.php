<?php

namespace App\Services\GamesListServices\Grid\GridGame;

use App\DTOs\GamesList\GridGameAnswerDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GameEngine\GameResultStatus;
use App\Enums\GameEngine\GameStatus;
use App\Models\Core\Player;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameInstance;
use App\Models\GameEngine\GameResult;
use App\Models\GamesList\Grid\GridAnswer;
use App\Models\GamesList\Grid\GridGame;
use App\Models\GameEngine\GameEntry;
use App\DTOs\GamesList\GridGameDTO;
use App\Services\GamesListServices\Grid\GridAnswer\IGridAnswerService;
use App\Services\GamesListServices\Grid\GridValidation\IGridValidationService;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class GridGameService implements IGridGameService
{
    const SLUG = 'football-grid';
    const ANSWERS_SIZE = 9;

    public function __construct(
        private readonly IGridValidationService $validationService,
        private readonly IGridAnswerService $answerService
    ) {
    }


    public function createGame(User $user, GridGameDTO $dto): GridGame
    {

        return DB::transaction(function () use ($user, $dto) {
            $difficulty = GameDifficulty::tryFrom($dto->difficulty) ?? GameDifficulty::EASY;
            $game = Game::where('slug', self::SLUG)->firstOrFail();

            $gameInstance = GameInstance::create([
                'game_id' => $game->id,
                'status' => GameStatus::ACTIVE,
                'start_at' => now(),
            ]);

            GameEntry::create([
                'game_instance_id' => $gameInstance->id,
                'user_id' => $user->id,
            ]);

            $gridGame = GridGame::create([
                'game_instance_id' => $gameInstance->id,
                'size' => $dto->size,
            ]);

            $this->validationService->createGameConditions($gridGame, $difficulty);

            return $gridGame->load(['conditions.objectable']);
        });
    }

    public function getGameDetails(int $gridGameId): GridGame
    {
        return GridGame::with([
            'conditions' => fn($query) => $query->orderBy('type')->orderBy('pos', 'asc'),
            'conditions.objectable',
        ])->findOrFail($gridGameId);
    }

    public function getGridStateForEntry(GridGame $game, GameEntry $entry): array
    {
        $answers = $game->answers()
            ->where('game_entry_id', $entry->id)
            ->with(['player:id,name,img_src'])
            ->get();

        $matrix = [];
        foreach ($answers as $answer) {
            $key = "{$answer->row_index}_{$answer->column_index}";
            $matrix[$key] = [
                'player' => $answer->player,
                'is_correct' => $answer->is_correct,
                'rarity_score' => $answer->rarity_score,
            ];
        }

        return $matrix;
    }

    public function isGridCompleted(GridGame $game, GameEntry $entry): bool
    {
        $requiredCells = $game->size * $game->size;
        $correctAnswers = $game->answers()
            ->where('game_entry_id', $entry->id)
            ->where('is_correct', true)
            ->count();

        return $correctAnswers >= $requiredCells;
    }

    public function submitAnswer(
        User $user,
        int $gameId,
        GridGameAnswerDTO $dto
    ): array {

        $playerId = $dto->playerId;
        $rowIndex = $dto->row;
        $columnIndex = $dto->col;

        $game = GridGame::findOrFail($gameId);
        $entry = GameEntry::where('game_instance_id', $game->game_instance_id)->firstOrFail();

        $answer = DB::transaction(function () use ($game, $entry, $playerId, $rowIndex, $columnIndex) {
            // 1. Fetch conditions for row and column
            $rowCondition = $game->conditions()
                ->where('type', 'row')
                ->where('pos', $rowIndex)
                ->firstOrFail();

            $colCondition = $game->conditions()
                ->where('type', 'column')
                ->where('pos', $columnIndex)
                ->firstOrFail();

            $player = Player::findOrFail($playerId);

            // 2. Validate guess
            $isCorrect = $this->validationService->validatePlayerForCell($player, $rowCondition, $colCondition);

            // 3. Store or update answer for this cell
            $answer = GridAnswer::updateOrCreate(
                [
                    'grid_game_id' => $game->id,
                    'game_entry_id' => $entry->id,
                    'row_index' => $rowIndex,
                    'column_index' => $columnIndex,
                ],
                [
                    'player_id' => $playerId,
                    'is_correct' => $isCorrect,
                    'rarity_score' => null, // Updated post-game or asynchronously
                ]
            );

            // 4. Update overall rarity score distribution
            if ($isCorrect) {
                $this->answerService->updateRarityScore($game, $rowIndex, $columnIndex, $playerId);
            }
            return $answer;
        });

        // Load player relationship for the response
        $answer->load('player');

        $this->handleGameCompletion($user, $game);

        // Refresh answer to get updated rarity_score
        $answer->refresh();
        $answer->load('player');

        $isComplete = $this->checkGameFinished($game->fresh());

        return [
            'answer' => $answer,
            'is_complete' => $isComplete,
        ];
    }

    private function handleGameCompletion(User $user, GridGame $game): void
    {
        if ($this->checkGameFinished($game)) {
            $this->finishGame($user, $game);
        }
    }

    private function finishGame(User $user, GridGame $game, GameStatus $gameStatus = GameStatus::FINISHED): void
    {
        if ($game->instance->status === GameStatus::FINISHED) {
            abort(400, "Game is already finished");
        }

        $isWon = $this->evaluateGridResult($game);

        $game->instance->update([
            'status' => $gameStatus->value,
            'end_at' => now(),
        ]);

        $gameEntry = GameEntry::where('user_id', $user->id)
            ->where('game_instance_id', $game->instance->id)
            ->firstOrFail();

        GameResult::updateOrCreate(
            ['game_entry_id' => $gameEntry->id],
            [
                'status' => $isWon ? GameResultStatus::WON->value : GameResultStatus::LOST->value,
                'score' => $this->evaluateGridScore($game),
                'is_winner' => $isWon,
            ]
        );
    }
    private function checkGameFinished(GridGame $gridGame): bool
    {
        $totalCells = $gridGame->size * $gridGame->size;
        $correctAnswersCount = $gridGame->answers()->count();
        return $correctAnswersCount === $totalCells;
    }

    private function evaluateGridResult(GridGame $gridGame): bool
    {
        $markedCount = $gridGame->answers()->where('is_correct', true)->count();
        return $markedCount === ($gridGame->size * $gridGame->size);
    }

    private function evaluateGridScore(GridGame $gridGame): int
    {
        $markedCount = $gridGame->answers()->where('is_correct', true)->count();
        $totalCells = $gridGame->size * $gridGame->size;

        $startAt = $gridGame->instance->start_at;
        $endAt = $gridGame->instance->end_at ?? now();

        $completionRate = $markedCount / $totalCells;
        $preScore = ($completionRate === 1.0) ? 1000 : (int) round(1000 * pow($completionRate, 3));

        $timeTaken = $endAt->diffInSeconds($startAt);
        $score = ceil($preScore - ($timeTaken / 10));

        return (int) max(0, $score);
    }
}