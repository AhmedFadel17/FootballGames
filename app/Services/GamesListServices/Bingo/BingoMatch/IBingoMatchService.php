<?php

namespace App\Services\GamesListServices\Bingo\BingoMatch;

use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchDTO;
use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchResponseDTO;
use App\DTOs\Pagination\PaginationDTO;

interface IBingoMatchService
{
    public function getByBingoGameId(int $id): BingoMatchResponseDTO;
} 