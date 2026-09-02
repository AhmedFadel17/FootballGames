<?php

namespace App\Services\GamesListServices\Grid\GridGameInstance;

use App\DTOs\GamesList\Grid\GridGameAnswerDTO;
use App\DTOs\GamesList\Grid\GridGameDTO;
use App\DTOs\GamesList\Grid\GridGameInstanceDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Enums\GameEngine\GameStatus;
use App\Models\Core\Player;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameInstance;
use App\Models\GamesList\Grid\GridAnswer;
use App\Models\GamesList\Grid\GridGame;
use App\Models\GamesList\Grid\GridGameInstance;
use App\Models\User;
use App\Services\GameEngine\GameInstances\IGameInstanceService;
use App\Services\GamesListServices\Grid\GridAnswer\IGridAnswerService;
use App\Services\GamesListServices\Grid\GridCondition\IGridConditionService;
use App\Services\GamesListServices\Grid\GridGame\IGridGameService;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class GridGameInstanceService implements IGridGameInstanceService
{
    const SLUG = 'football-grid';
    const ANSWERS_SIZE = 9;

    public function __construct(
        private readonly IGridConditionService $conditionService,
        private readonly IGridAnswerService $answerService,
        private readonly IGridGameService $gridGameService,
        private readonly IGameInstanceService $gameInstanceService,
    ) {
    }

    public function startGame(User $user, GridGameInstanceDTO $dto): GridGameInstance
    {
        return DB::transaction(function () use ($user, $dto) {
            $difficulty = GameDifficulty::tryFrom($dto->difficulty) ?? GameDifficulty::EASY;
            $game = Game::where('slug', self::SLUG)->firstOrFail();

            $gridGame = $this->gridGameService->getRandom($user, $difficulty);
            if ($gridGame === null) {
                $gridGame = $this->gridGameService->create(new GridGameDTO(
                    size: $dto->size,
                    difficulty: $dto->difficulty,
                ));
            }

            // Delegated Session Creation (Stamina check, GameInstance, GameEntry)
            [$gameInstance, $gameEntry] = $this->gameInstanceService->startSession($user, $game);

            $gridGameInstance = GridGameInstance::create([
                'game_instance_id' => $gameInstance->id,
                'grid_game_id' => $gridGame->id,
            ]);

            return $gridGameInstance->load('gridGame');
        });
    }

    public function getGameDetails(int $gridGameId): GridGameInstance
    {
        return GridGameInstance::with([
            'gridGame.conditions' => fn($query) => $query->orderBy('type')->orderBy('pos', 'asc'),
            'gridGame.conditions.objectable',
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
        int $gridGameInstanceId,
        GridGameAnswerDTO $dto
    ): array {
        $playerId = $dto->playerId;
        $rowIndex = $dto->row;
        $columnIndex = $dto->col;

        return DB::transaction(function () use ($user, $gridGameInstanceId, $playerId, $rowIndex, $columnIndex) {
            $gridGameInstance = GridGameInstance::with(['gameInstance.entries', 'gridGame'])
                ->findOrFail($gridGameInstanceId);

            $gameInstance = $gridGameInstance->gameInstance;

            if ($gameInstance->status === GameStatus::FINISHED) {
                throw new HttpException(400, "Game session is already finished.");
            }

            $gameEntry = $gameInstance->entries->where('user_id', $user->id)->first();
            if ($gameEntry === null) {
                throw new HttpException(404, "Game entry not found.");
            }

            $rowCondition = $gridGameInstance->gridGame->conditions()
                ->where('type', 'row')
                ->where('pos', $rowIndex)
                ->firstOrFail();

            $colCondition = $gridGameInstance->gridGame->conditions()
                ->where('type', 'column')
                ->where('pos', $columnIndex)
                ->firstOrFail();

            $player = Player::findOrFail($playerId);
            $isCorrect = $this->conditionService->validatePlayerForCell($player, $rowCondition, $colCondition);

            $answer = GridAnswer::updateOrCreate(
                [
                    'grid_game_instance_id' => $gridGameInstance->id,
                    'game_entry_id' => $gameEntry->id,
                    'row_index' => $rowIndex,
                    'column_index' => $columnIndex,
                ],
                [
                    'player_id' => $playerId,
                    'is_correct' => $isCorrect,
                    'rarity_score' => null,
                ]
            );

            if ($isCorrect) {
                $this->answerService->updateRarityScore($gridGameInstance, $rowIndex, $columnIndex, $playerId);
            }

            $isComplete = $this->checkGameFinished($gridGameInstance);

            if ($isComplete) {
                $this->finishGame($gameInstance, $gameEntry, $gridGameInstance->gridGame);
            }

            return ["answer" => $answer->fresh()->load('player'), "is_complete" => $isComplete];
        });
    }

    private function finishGame(
        GameInstance $gameInstance,
        GameEntry $gameEntry,
        GridGame $gridGame
    ): void {
        $guesses = GridAnswer::where('game_entry_id', $gameEntry->id)->get();
        $correctCount = $guesses->where('is_correct', true)->count();
        $totalItems = $gridGame->size * $gridGame->size;
        $isWon = $correctCount >= $totalItems;
        $now = now();
        $durationSeconds = (int) $now->diffInSeconds($gameInstance->start_at);

        // Pass metrics to GameInstanceService to handle calculations, result persistence, and player progress updates
        $this->gameInstanceService->finishSession(
            gameInstance: $gameInstance,
            gameEntry: $gameEntry,
            isWon: $isWon,
            correctCount: $correctCount,
            totalItems: $totalItems,
            durationSeconds: $durationSeconds,
            difficulty: $gridGame->difficulty
        );
    }

    private function checkGameFinished(GridGameInstance $gridGameInstance): bool
    {
        $size = $gridGameInstance->gridGame->size;
        $totalCells = $size * $size;
        $answersCount = $gridGameInstance->answers()->count();

        return $answersCount === $totalCells;
    }
}