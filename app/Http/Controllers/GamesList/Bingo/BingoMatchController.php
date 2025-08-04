<?php

namespace App\Http\Controllers\GamesList\Bingo;

use App\Http\Controllers\Controller;
use App\Services\GamesListServices\Bingo\BingoMatch\IBingoMatchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Request;

class BingoMatchController extends Controller
{
    private readonly IBingoMatchService $_service;
    
    public function __construct(IBingoMatchService $service)
    {
        $this->_service = $service;
    }

    public function getByGameId(Request $request,int $id): JsonResponse
    {
        $bingoMatch = $this->_service->getByBingoGameId($id);
        return response()->json($bingoMatch);
    }

} 