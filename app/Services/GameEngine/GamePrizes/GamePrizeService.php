<?php

namespace App\Services\GameEngine\GamePrizes;

use App\DTOs\GameEngine\GamePrizeDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GameEngine\GamePrize;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GamePrizeService implements IGamePrizeService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(GamePrize::query(), $dto)
            ->allowFilters(['game_instance_id', 'rank'])
            ->allowSorts(['id', 'game_instance_id', 'rank'])
            ->searchable(['id', 'game_instance_id', 'rank'])
            ->paginate();
    }


    public function getById(int $id): GamePrize
    {
        $gamePrize = GamePrize::findOrFail($id);
        return $gamePrize;
    }

    public function create(GamePrizeDTO $dto): GamePrize
    {
        $gamePrize = GamePrize::create($dto->toArray());
        return $gamePrize;
    }

    public function update(int $id, GamePrizeDTO $dto): GamePrize
    {
        $gamePrize = GamePrize::findOrFail($id);
        $gamePrize->update($dto->toArray());
        return $gamePrize;
    }

    public function delete(int $id): void
    {
        $gamePrize = GamePrize::findOrFail($id);
        $gamePrize->delete();
    }
}