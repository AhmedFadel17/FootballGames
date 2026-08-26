<?php

namespace App\Http\Controllers\GamesList;

use App\DTOs\GamesList\GridGameAnswerDTO;
use App\DTOs\GamesList\GridGameDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\GridGame\CreateGridGameRequest;
use App\Http\Requests\GamesList\GridGame\SubmitGridGameAnswerRequest;
use App\Resources\GamesList\Grid\GridAnswerResource;
use App\Resources\GamesList\Grid\GridGameResource;
use App\Services\GamesListServices\Grid\GridAnswer\IGridAnswerService;
use App\Services\GamesListServices\Grid\GridGame\IGridGameService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GridGameController extends Controller
{
    use ApiResponses;
    public function __construct(
        private IGridGameService $gridGameService,
        private IGridAnswerService $gridAnswerService
    ) {
    }

    public function store(CreateGridGameRequest $request): JsonResponse
    {
        $dto = GridGameDTO::fromRequest($request);
        $user = $request->user();
        $game = $this->gridGameService->createGame($user, $dto);

        return $this->successResponse(
            new GridGameResource($game),
            'Grid game created successfully'
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {

        $user = $request->user();
        $game = $this->gridGameService->getGameDetails($id);

        return $this->successResponse(
            new GridGameResource($game),
            'Grid game retrieved successfully'
        );
    }


    public function submitAnswer(SubmitGridGameAnswerRequest $request, int $gameId): JsonResponse
    {
        $dto = GridGameAnswerDTO::fromRequest($request);
        $user = $request->user();
        $result = $this->gridGameService->submitAnswer($user, $gameId, $dto);
        return $this->successResponse(
            [
                'answer' => new GridAnswerResource($result['answer']),
                'is_complete' => $result['is_complete'],
            ],
            'Grid game answer submitted successfully'
        );
    }
}