<?php

namespace App\Http\Controllers\GamesList;

use App\DTOs\GamesList\BingoGameDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\BingoGame\CreateBingoGameRequest;
use App\Resources\GameEngine\GameResultResource;
use App\Resources\GamesList\Bingo\BingoConditionResource;
use App\Resources\GamesList\Bingo\BingoGameResource;
use App\Resources\GamesList\Bingo\BingoMatchResource;
use App\Services\GamesListServices\Bingo\BingoCondition\IBingoConditionService;
use App\Services\GamesListServices\Bingo\BingoGame\IBingoGameService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BingoGameController extends Controller
{
    use ApiResponses;

    public function __construct(
        private readonly IBingoGameService $gameService,
        private readonly IBingoConditionService $conditionService
    ) {
    }

    public function store(CreateBingoGameRequest $request): JsonResponse
    {
        $dto = BingoGameDTO::fromRequest($request);
        $user = $request->user();
        $bingoGame = $this->gameService->create($user, $dto);

        return $this->successResponse(
            new BingoGameResource($bingoGame),
            'Bingo game created successfully'
        );
    }

    public function getConditions(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $conditions = $this->conditionService->getByBingoGameId($user, $id);

        return $this->successResponse(
            BingoConditionResource::collection($conditions),
            'Bingo conditions retrieved successfully'
        );
    }

    public function nextMatch(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $match = $this->gameService->nextMatch($user, $id);

        return $this->successResponse(
            new BingoMatchResource($match),
            'Bingo match retrieved successfully'
        );
    }

    public function check(Request $request, int $id, int $pos): JsonResponse
    {
        $user = $request->user();
        $condition = $this->gameService->check($user, $id, $pos);

        return $this->successResponse(
            new BingoConditionResource($condition),
            'Bingo condition checked successfully'
        );
    }

}