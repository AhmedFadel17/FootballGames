<?php

namespace App\Http\Controllers\GamesList;

use App\DTOs\GamesList\Grid\GridGameAnswerDTO;
use App\DTOs\GamesList\Grid\GridGameDTO;
use App\DTOs\GamesList\Grid\GridGameInstanceDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\GridGame\CreateGridGameRequest;
use App\Http\Requests\GamesList\GridGame\SubmitGridGameAnswerRequest;
use App\Http\Requests\Shared\BaseFilterRequest;
use App\Resources\GamesList\Grid\GridAnswerResource;
use App\Resources\GamesList\Grid\GridGameInstanceResource;
use App\Resources\GamesList\Grid\GridGameResource;
use App\Services\GamesListServices\Grid\GridAnswer\IGridAnswerService;
use App\Services\GamesListServices\Grid\GridGame\IGridGameService;
use App\Services\GamesListServices\Grid\GridGameInstance\IGridGameInstanceService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GridGameController extends Controller
{
    use ApiResponses;
    public function __construct(
        private IGridGameService $gridGameService,
        private IGridGameInstanceService $gridGameInstanceService
    ) {
    }

    public function index(BaseFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $players = $this->gridGameService->getAll($dto);
        return $this->paginatedResponse($players, GridGameResource::class, 'Grid games list retrieved successfully');
    }

    public function show($id): JsonResponse
    {
        $game = $this->gridGameService->getById($id);
        return $this->successResponse(new GridGameResource($game), 'Grid game retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $dto = GridGameDTO::fromRequest($request);
        $game = $this->gridGameService->create($dto);
        return $this->successResponse(new GridGameResource($game), 'Grid game created successfully', 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $dto = GridGameDTO::fromRequest($request);
        $game = $this->gridGameService->update($id, $dto);
        return $this->successResponse(new GridGameResource($game), 'Grid game updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->gridGameService->delete($id);
        return $this->successResponse(null, 'Grid game deleted successfully');
    }








    public function startGame(CreateGridGameRequest $request): JsonResponse
    {
        $dto = GridGameInstanceDTO::fromRequest($request);
        $user = $request->user();
        $game = $this->gridGameInstanceService->startGame($user, $dto);

        return $this->successResponse(
            new GridGameInstanceResource($game),
            'Grid game started successfully'
        );
    }

    public function getGameInstanceDetails(Request $request, int $id): JsonResponse
    {

        $user = $request->user();
        $game = $this->gridGameInstanceService->getGameDetails($id);

        return $this->successResponse(
            new GridGameInstanceResource($game),
            'Grid game retrieved successfully'
        );
    }


    public function submitAnswer(SubmitGridGameAnswerRequest $request, int $gameId): JsonResponse
    {
        $dto = GridGameAnswerDTO::fromRequest($request);
        $user = $request->user();
        $result = $this->gridGameInstanceService->submitAnswer($user, $gameId, $dto);
        return $this->successResponse(
            [
                'answer' => new GridAnswerResource($result['answer']),
                'is_complete' => $result['is_complete'],
            ],
            'Grid game answer submitted successfully'
        );
    }
}