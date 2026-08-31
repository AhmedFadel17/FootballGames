<?php

namespace App\Http\Controllers\GamesList;

use App\DTOs\GamesList\TopList\TopListGameInstanceDTO;
use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\TopList\CreateTopListGameRequest;
use App\Http\Requests\GamesList\TopList\UpdateTopListGameRequest;
use App\Http\Requests\Shared\BaseFilterRequest;
use App\Resources\GamesList\TopList\TopListGameInstanceResource;
use App\Resources\GamesList\TopList\TopListGameResource;
use App\Resources\GamesList\TopList\TopListGuessResource;
use App\Services\GamesListServices\TopList\TopListGame\ITopListGameService;
use App\Services\GamesListServices\TopList\TopListGameInstance\ITopListGameInstanceService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TopListGameController extends Controller
{
    use ApiResponses;

    public function __construct(
        private readonly ITopListGameService $service,
        private readonly ITopListGameInstanceService $topListGameInstanceService
    ) {
    }

    public function index(BaseFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $players = $this->service->getAll($dto);
        return $this->paginatedResponse($players, TopListGameResource::class, 'Games list retrieved successfully');
    }

    public function show($id): JsonResponse
    {
        $player = $this->service->getById($id);
        return $this->successResponse(new TopListGameResource($player), 'Game list retrieved successfully');
    }

    public function store(CreateTopListGameRequest $request): JsonResponse
    {
        $dto = TopListGameDTO::fromRequest($request);
        $game = $this->service->create($dto);
        return $this->successResponse(new TopListGameResource($game), 'Top list game created successfully', 201);
    }

    public function update(UpdateTopListGameRequest $request, $id): JsonResponse
    {
        $dto = TopListGameDTO::fromRequest($request);
        $player = $this->service->update($id, $dto);
        return $this->successResponse(new TopListGameResource($player), 'Top list game updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(null, 'Top list game deleted successfully');
    }

    public function getGameInstanceDetails(int $id): JsonResponse
    {
        $game = $this->topListGameInstanceService->getGameInstanceDetails($id);
        return $this->successResponse(new TopListGameInstanceResource($game));
    }


    public function startGame(CreateTopListGameRequest $request): JsonResponse
    {
        $user = $request->user();
        $dto = TopListGameInstanceDTO::fromRequest($request);
        $game = $this->topListGameInstanceService->startGame($user, $dto);
        return $this->successResponse(new TopListGameInstanceResource($game));
    }


    public function check(Request $request, int $id, int $objectId): JsonResponse
    {
        $user = $request->user();
        $guess = $this->topListGameInstanceService->check($user, $id, $objectId);
        return $this->successResponse(new TopListGuessResource($guess));
    }

}
