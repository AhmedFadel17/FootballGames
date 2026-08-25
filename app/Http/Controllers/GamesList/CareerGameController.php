<?php

namespace App\Http\Controllers\GamesList;

use App\DTOs\GamesList\CareerGameDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\CareerGame\CreateCareerGameRequest;
use App\Resources\GamesList\Career\CareerGameResource;
use App\Services\GamesListServices\Career\ICareerGameService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CareerGameController extends Controller
{
    use ApiResponses;

    public function __construct(
        private readonly ICareerGameService $careerService
    ) {
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $game = $this->careerService->getById($request->user(), $id);
        return $this->successResponse(new CareerGameResource($game), 'Career game retrieved successfully');
    }

    public function store(CreateCareerGameRequest $request): JsonResponse
    {
        $dto = CareerGameDTO::fromRequest($request);
        $game = $this->careerService->create($request->user(), $dto);
        return $this->successResponse(new CareerGameResource($game), 'Career game started successfully');
    }

    public function reveal(Request $request, int $id): JsonResponse
    {
        $game = $this->careerService->revealNextStep($request->user(), $id);
        return $this->successResponse(new CareerGameResource($game), 'Next step revealed');
    }

    public function guess(Request $request, int $id): JsonResponse
    {
        $request->validate(['guessed_player_id' => 'required|integer|exists:players,id']);

        $result = $this->careerService->guess($request->user(), $id, $request->guessed_player_id);
        return $this->successResponse($result, 'Guess evaluated');
    }
}