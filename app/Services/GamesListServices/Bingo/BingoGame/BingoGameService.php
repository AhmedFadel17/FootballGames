<?php

namespace App\Services\GamesListServices\Bingo\BingoGame;

use App\DTOs\GameEngine\GameEntryDTO;
use App\DTOs\GameEngine\GameInstanceDTO;
use App\DTOs\GameEngine\GameResultDTO;
use App\DTOs\GamesList\Bingo\BingoGameDTO;
use App\Models\GameEngine\Game;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameResult;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Models\GamesList\Bingo\BingoGame;
use App\Models\GamesList\Bingo\BingoMatch;
use App\Models\User;
use App\Services\GameEngine\GameEntries\IGameEntryService;
use App\Services\GameEngine\GameInstances\IGameInstanceService;
use App\Services\GameEngine\GameResults\IGameResultService;
use App\Services\GamesListServices\Bingo\BingoCondition\IBingoConditionService;
use App\Services\GamesListServices\Bingo\BingoMatch\IBingoMatchService;
use App\Services\Pagination\IPaginationService;
use App\Enums\GameEngine\GameStatus;
use App\Enums\GameEngine\GameResultStatus;
use Illuminate\Support\Facades\DB;
use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GamesList\TopList\TopListGame;
use App\Models\GamesList\TopList\TopListItem;
use App\Enums\GameEngine\GameDifficulty;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
class BingoGameService implements IBingoGameService
{
    public const ANSWERS_SIZE = 40;

    public function __construct(
        private IPaginationService $_paginationService,
        private IBingoConditionService $_bingoConditionService,
        private IBingoMatchService $_bingoMatchService,
    ) {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(BingoGame::query()->with(['conditions', 'matches']), $dto)
            ->allowFilters(['size', 'difficulty'])
            ->allowSorts(['id', 'size', 'difficulty'])
            ->paginate();
    }

    public function create(BingoGameDTO $dto): BingoGame
    {
        return DB::transaction(function () use ($dto) {
            $bingoGame = BingoGame::create([
                'size' => $dto->size,
                'difficulty' => $dto->difficulty,
                'total_answers' => $dto->totalAnswers ?? $this::ANSWERS_SIZE,
            ]);

            $this->_bingoConditionService->createGameConditions($bingoGame);
            $this->_bingoMatchService->createGameMatches($bingoGame, $this::ANSWERS_SIZE);
            return $bingoGame->load(['conditions', 'matches']);
        });
    }

    public function getById($id): BingoGame
    {
        $bingoGame = BingoGame::with([
            'conditions',
            'matches',
        ])->findOrFail($id);
        return $bingoGame;
    }

    public function update($id, BingoGameDTO $data): BingoGame
    {
        $bingoGame = BingoGame::findOrFail($id);
        $bingoGame->update($data->toUpdateArray());
        $bingoGame->load(['conditions', 'matches']);
        return $bingoGame;
    }
    public function delete($id): bool
    {
        $bingoGame = BingoGame::findOrFail($id);
        $bingoGame->delete();
        return true;
    }

    public function getRandom(User $user, GameDifficulty $difficulty, int $size = 3): ?BingoGame
    {
        return BingoGame::with([
            'conditions',
            'matches',
        ])
            ->where('difficulty', $difficulty->value)
            ->where('size', $size)
            ->whereDoesntHave('bingoInstances.gameInstance.entries', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->inRandomOrder()
            ->first();
    }
}