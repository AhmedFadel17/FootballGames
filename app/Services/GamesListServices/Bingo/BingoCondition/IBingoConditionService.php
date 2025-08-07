<?php

namespace App\Services\GamesListServices\Bingo\BingoCondition;

use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionDTO;
use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GamesList\Bingo\BingoCondition;

interface IBingoConditionService
{
    public function getByBingoGameId(int $id): array;
    public static function getByBingoGameIdAndPosition(int $gameId,int $pos): BingoCondition;

} 