<?php

namespace App\Http\Controllers\GamesList\Bingo;

use App\DTOs\GamesList\Bingo\BingoCondition\BingoConditionDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\Bingo\BingoCondition\CreateBingoConditionRequest;
use App\Http\Requests\GamesList\Bingo\BingoCondition\BingoConditionFilterRequest;
use App\Http\Requests\GamesList\Bingo\BingoCondition\UpdateBingoConditionRequest;
use App\Services\GamesListServices\Bingo\BingoCondition\IBingoConditionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Request;

class BingoConditionController extends Controller
{
    private readonly IBingoConditionService $_service;
    
    public function __construct(IBingoConditionService $service)
    {
        $this->_service = $service;
    }

    public function getByGameId(Request $request,int $id): JsonResponse
    {
        $bingoConditions = $this->_service->getByBingoGameId($id);
        return response()->json($bingoConditions);
    }

 
} 