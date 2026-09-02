<?php

namespace App\Http\Controllers\GamesList;

use App\DTOs\GamesList\Career\CareerGameDTO;
use App\DTOs\GamesList\Career\CareerGameInstanceDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\CareerGame\CreateCareerGameRequest;
use App\Http\Requests\Shared\BaseFilterRequest;
use App\Resources\GamesList\Career\CareerGameInstanceResource;
use App\Resources\GamesList\Career\CareerGameResource;
use App\Services\GamesListServices\Career\CareerGame\ICareerGameService;
use App\Services\GamesListServices\Career\CareerGameInstance\ICareerGameInstanceService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CareerGameController extends Controller
{
    use ApiResponses;

    public function __construct(
        private readonly ICareerGameService $service,
        private readonly ICareerGameInstanceService $careerInstanceService,
    ) {
    }

    public function index(BaseFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $careerGames = $this->service->getAll($dto);
        return $this->paginatedResponse($careerGames, CareerGameResource::class, 'Career games list retrieved successfully');
    }

    public function show($id): JsonResponse
    {
        $careerGame = $this->service->getById($id);
        return $this->successResponse(new CareerGameResource($careerGame), 'Career game retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $dto = CareerGameDTO::fromRequest($request);
        $careerGame = $this->service->create($dto);
        return $this->successResponse(new CareerGameResource($careerGame), 'Career game created successfully', 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $dto = CareerGameDTO::fromRequest($request);
        $careerGame = $this->service->update($id, $dto);
        return $this->successResponse(new CareerGameResource($careerGame), 'Career game updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(null, 'Career game deleted successfully');
    }













    public function getGameInstance(Request $request, int $id): JsonResponse
    {
        $gameInstance = $this->careerInstanceService->getById($request->user(), $id);
        return $this->successResponse(new CareerGameInstanceResource($gameInstance), 'Career game instance retrieved successfully');
    }

    public function startGame(CreateCareerGameRequest $request): JsonResponse
    {
        $dto = CareerGameInstanceDTO::fromRequest($request);
        $gameInstance = $this->careerInstanceService->startGame($request->user(), $dto);
        return $this->successResponse(new CareerGameInstanceResource($gameInstance), 'Career game started successfully');
    }

    public function reveal(Request $request, int $id): JsonResponse
    {
        $gameInstance = $this->careerInstanceService->revealNextStep($request->user(), $id);
        return $this->successResponse(new CareerGameInstanceResource($gameInstance), 'Next step revealed');
    }

    public function guess(Request $request, int $id): JsonResponse
    {
        $request->validate(['guessed_player_id' => 'required|integer|exists:players,id']);

        $result = $this->careerInstanceService->guess($request->user(), $id, $request->guessed_player_id);
        return $this->successResponse($result, 'Guess evaluated');
    }
}