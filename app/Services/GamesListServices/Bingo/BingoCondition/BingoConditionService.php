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
        $conditions = BingoCondition::query()
            ->with(['objectable', 'match.player'])
            ->where('bingo_game_id', $id)
            ->get();

        return $conditions
            ->map(fn($condition) => BingoConditionResponseDTO::fromModel($condition))
            ->all();
    }
} 