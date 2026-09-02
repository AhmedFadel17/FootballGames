<?php

namespace App\Services\GamesListServices\Career\CareerGame;

use App\DTOs\GamesList\Career\CareerGameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Enums\Core\TeamType;
use App\Models\Core\Player;
use App\Models\GamesList\Career\CareerGame;
use App\Models\User;
use App\Enums\GameEngine\GameDifficulty;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CareerGameService implements ICareerGameService
{

    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(CareerGame::query()->with('player'), $dto)
            ->allowFilters(['difficulty', 'total_steps'])
            ->allowSorts(['id', 'difficulty', 'total_steps'])
            ->paginate();
    }

    public function create(CareerGameDTO $dto): CareerGame
    {
        return DB::transaction(function () use ($dto) {
            $difficulty = GameDifficulty::tryFrom($dto->difficulty) ?? GameDifficulty::EASY;
            $minPopularity = $difficulty->minPopularity(Player::class);
            $type1TeamsFilter = fn($query) => $query->whereHas('team', fn($q) => $q->where('type', TeamType::CLUB));
            $player = Player::where('popularity', '>=', $minPopularity)
                ->whereHas('teamPeriods', $type1TeamsFilter, '>=', 3)
                ->inRandomOrder()
                ->firstOrFail();

            $totalSteps = $player->teamPeriods()
                ->whereHas('team', fn($q) => $q->where('type', TeamType::CLUB))
                ->count();
            $careerGame = CareerGame::create([
                'player_id' => $player->id,
                'difficulty' => $difficulty->value,
                'total_steps' => $totalSteps,
            ]);

            return $careerGame->load('player');
        });
    }

    public function getById($id): CareerGame
    {
        $careerGame = CareerGame::with([
            'player',
        ])->findOrFail($id);
        return $careerGame;
    }

    public function update($id, CareerGameDTO $data): CareerGame
    {
        $careerGame = CareerGame::findOrFail($id);
        $careerGame->update($data->toUpdateArray());
        $careerGame->load('player');
        return $careerGame;
    }
    public function delete($id): bool
    {
        $careerGame = CareerGame::findOrFail($id);
        $careerGame->delete();
        return true;
    }

    public function getRandom(User $user, GameDifficulty $difficulty): ?CareerGame
    {
        return CareerGame::with([
            'player',
        ])
            ->where('difficulty', $difficulty->value)
            ->whereDoesntHave('careerInstances.gameInstance.entries', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->inRandomOrder()
            ->first();
    }
}
