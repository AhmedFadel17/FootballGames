<?php

namespace App\Services\GamesListServices\Grid\GridGame;

use App\DTOs\Pagination\PaginationDTO;
use App\Enums\GameEngine\GameDifficulty;
use App\Models\GamesList\Grid\GridGame;
use App\DTOs\GamesList\Grid\GridGameDTO;
use App\Services\GamesListServices\Grid\GridCondition\IGridConditionService;
use App\Services\Pagination\IPaginationService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class GridGameService implements IGridGameService
{
    public function __construct(
        private IPaginationService $_paginationService,
        private IGridConditionService $_gridValidationService,
    ) {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(GridGame::query(), $dto)
            ->allowFilters(['size', 'difficulty'])
            ->allowSorts(['id', 'size', 'difficulty'])
            ->paginate();
    }

    public function create(GridGameDTO $dto): GridGame
    {
        return DB::transaction(function () use ($dto) {
            $gridGame = GridGame::create([
                'size' => $dto->size,
                'difficulty' => $dto->difficulty ?? GameDifficulty::EASY->value,
            ]);
            $this->_gridValidationService->createGameConditions($gridGame);
            return $gridGame->load('conditions');
        });
    }

    public function getById($id): GridGame
    {
        $gridGame = GridGame::with([
            'conditions',
        ])->findOrFail($id);
        return $gridGame;
    }

    public function update($id, GridGameDTO $data): GridGame
    {
        $gridGame = GridGame::findOrFail($id);
        $gridGame->update($data->toUpdateArray());
        $gridGame->load('conditions');
        return $gridGame;
    }
    public function delete($id): bool
    {
        $gridGame = GridGame::findOrFail($id);
        $gridGame->delete();
        return true;
    }

    public function getRandom(User $user, GameDifficulty $difficulty, int $size): ?GridGame
    {
        return GridGame::with([
            'conditions',
        ])
            ->where('difficulty', $difficulty->value)
            ->where('size', $size)
            ->whereDoesntHave('gridGameInstances.gameInstance.entries', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->inRandomOrder()
            ->first();
    }
}