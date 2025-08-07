<?php

namespace App\Services\GamesListServices\Bingo\BingoMatch;

use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchDTO;
use App\DTOs\GamesList\Bingo\BingoMatch\BingoMatchResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GamesList\Bingo\BingoMatch;

interface IBingoMatchService
{
    public function getByBingoGameId(int $gameId): BingoMatchResponseDTO;
    public function getBingoGameCurrentMatch(int $gameId): BingoMatch;

} 