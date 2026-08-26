<?php

namespace App\Http\Controllers\GamesList;

use App\DTOs\GamesList\TopList\TopListGameInstanceDTO;
use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\TopList\CreateTopListGameRequest;
use App\Resources\GamesList\TopList\TopListGameInstanceResource;
use App\Resources\GamesList\TopList\TopListGameResource;
use App\Resources\GamesList\TopList\TopListGuessResource;
use App\Services\GamesListServices\TopList\ITopListGameService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TopListGameController extends Controller
{
    use ApiResponses;
    private readonly ITopListGameService $_service;

    public function __construct(ITopListGameService $service)
    {
        $this->_service = $service;
    }


    public function show(Request $request, int $id): JsonResponse
    {
        $game = $this->_service->getGameInstanceDetails($id);
        return $this->successResponse(new TopListGameInstanceResource($game));
    }


    public function startGame(CreateTopListGameRequest $request): JsonResponse
    {
        $user = $request->user();
        $dto = TopListGameInstanceDTO::fromRequest($request);
        $game = $this->_service->startGame($user, $dto);
        return $this->successResponse(new TopListGameInstanceResource($game));
    }


    public function check(Request $request, int $id, int $objectId): JsonResponse
    {
        $user = $request->user();
        $guess = $this->_service->check($user, $id, $objectId);
        return $this->successResponse(new TopListGuessResource($guess));
    }


    public function store(Request $request): JsonResponse
    {
        $dto = TopListGameDTO::fromRequest($request);
        $game = $this->_service->create($dto);
        return $this->successResponse(new TopListGameResource($game));
    }


}
