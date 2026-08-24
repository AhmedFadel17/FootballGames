<?php

namespace App\Http\Controllers\GamesList\Bingo;

use App\DTOs\GamesList\BingoGameDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\Bingo\BingoGame\CreateBingoGameRequest;
use App\Resources\GameEngine\GameResultResource;
use App\Resources\GamesList\Bingo\BingoConditionResource;
use App\Resources\GamesList\Bingo\BingoGameResource;
use App\Resources\GamesList\Bingo\BingoMatchResource;
use App\Services\GamesListServices\Bingo\BingoGame\IBingoGameService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BingoGameController extends Controller
{
    use ApiResponses;
    private readonly IBingoGameService $_service;

    public function __construct(IBingoGameService $service)
    {
        $this->_service = $service;
    }

    public function nextMatch(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $match = $this->_service->nextMatch($user, $id);
        return $this->successResponse(new BingoMatchResource($match), 'Bingo match retrieved successfully');
    }
    public function check(Request $request, int $id, int $pos): JsonResponse
    {
        $user = $request->user();
        $condition = $this->_service->check($user, $id, $pos);
        return $this->successResponse(new BingoConditionResource($condition), 'Bingo condition checked successfully');
    }


    public function cancelGame(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $this->_service->cancelGame($user, $id);
        return $this->successResponse(true, 'Bingo game cancelled successfully');
    }

    public function gameResults(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $res = $this->_service->results($user, $id);
        return $this->successResponse(new GameResultResource($res), 'Bingo game results retrieved successfully');
    }

    public function store(CreateBingoGameRequest $request): JsonResponse
    {
        $dto = BingoGameDTO::fromRequest($request);
        $user = $request->user();
        $bingoGame = $this->_service->create($user, $dto);
        return $this->successResponse(new BingoGameResource($bingoGame), 'Bingo game created successfully');
    }
}
