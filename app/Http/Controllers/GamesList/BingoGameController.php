<?php

namespace App\Http\Controllers\GamesList;

use App\DTOs\GamesList\Bingo\BingoGameDTO;
use App\DTOs\GamesList\Bingo\BingoGameInstanceDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\BingoGame\CreateBingoGameRequest;
use App\Http\Requests\Shared\BaseFilterRequest;
use App\Resources\GamesList\Bingo\BingoConditionResource;
use App\Resources\GamesList\Bingo\BingoGameInstanceResource;
use App\Resources\GamesList\Bingo\BingoGameResource;
use App\Resources\GamesList\Bingo\BingoGuessResource;
use App\Resources\GamesList\Bingo\BingoMatchResource;
use App\Services\GamesListServices\Bingo\BingoCondition\IBingoConditionService;
use App\Services\GamesListServices\Bingo\BingoGame\IBingoGameService;
use App\Services\GamesListServices\Bingo\BingoGameInstance\IBingoGameInstanceService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BingoGameController extends Controller
{
    use ApiResponses;

    public function __construct(
        private readonly IBingoGameService $gameService,
        private readonly IBingoGameInstanceService $instanceService,
        private readonly IBingoConditionService $conditionService
    ) {
    }

    public function index(BaseFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $bingoGames = $this->gameService->getAll($dto);
        return $this->paginatedResponse($bingoGames, BingoGameResource::class, 'Bingo games list retrieved successfully');
    }

    public function show($id): JsonResponse
    {
        $bingoGame = $this->gameService->getById($id);
        return $this->successResponse(new BingoGameResource($bingoGame), 'Bingo game retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $dto = BingoGameDTO::fromRequest($request);
        $bingoGame = $this->gameService->create($dto);
        return $this->successResponse(new BingoGameResource($bingoGame), 'Bingo game created successfully', 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $dto = BingoGameDTO::fromRequest($request);
        $bingoGame = $this->gameService->update($id, $dto);
        return $this->successResponse(new BingoGameResource($bingoGame), 'Bingo game updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->gameService->delete($id);
        return $this->successResponse(null, 'Bingo game deleted successfully');
    }










    public function getGameInstance(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $bingoGameInstance = $this->instanceService->getById($user, $id);

        return $this->successResponse(
            new BingoGameInstanceResource($bingoGameInstance),
            'Bingo game retrieved successfully'
        );
    }

    public function startGame(CreateBingoGameRequest $request): JsonResponse
    {
        $dto = BingoGameInstanceDTO::fromRequest($request);
        $user = $request->user();
        $bingoGame = $this->instanceService->startGame($user, $dto);

        return $this->successResponse(
            new BingoGameInstanceResource($bingoGame),
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
        $match = $this->instanceService->nextMatch($user, $id);

        return $this->successResponse(
            $match ? new BingoMatchResource($match) : null,
            'Bingo match retrieved successfully'
        );
    }

    public function skip(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $result = $this->instanceService->skip($user, $id);

        return $this->successResponse(
            [
                'match' => $result['match'] ? new BingoMatchResource($result['match']) : null,
                'is_complete' => $result['is_complete'],
            ],
            'Bingo guess checked successfully'
        );
    }

    public function check(Request $request, int $id, int $pos): JsonResponse
    {
        $user = $request->user();
        $result = $this->instanceService->check($user, $id, $pos);

        return $this->successResponse(
            [
                'guess' => new BingoGuessResource($result['guess']),
                'is_complete' => $result['is_complete'],
            ],
            'Bingo guess checked successfully'
        );
    }
}