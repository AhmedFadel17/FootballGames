<?php

namespace App\Services\GamesListServices\Bingo\BingoCondition;

use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionDTO;
use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GamesList\Bingo\BingoCondition;
use App\Services\Pagination\IPaginationService;

class BingoConditionService implements IBingoConditionService
{

    public function getByBingoGameId(int $id): array
    {
        $query =BingoCondition::query();
        return $query->where('bingo_game_id',$id)
            ->map(fn($game) => BingoConditionResponseDTO::fromModel($game))
            ->all();
    }
} 