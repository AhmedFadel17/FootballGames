<?php

namespace App\Http\Controllers\GameEngine;

use App\DTOs\GameEngine\GameResultDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GameEngine\GameResults\CreateGameResultRequest;
use App\Http\Requests\GameEngine\GameResults\GameResultFilterRequest;
use App\Http\Requests\GameEngine\GameResults\UpdateGameResultRequest;
use App\Resources\GameEngine\GameResultResource;
use App\Services\GameEngine\GameResults\IGameResultService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameResultController extends Controller
{
    use ApiResponses;
    private readonly IGameResultService $_service;

    public function __construct(IGameResultService $service)
    {
        $this->_service = $service;
    }

    public function index(GameResultFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $gameResults = $this->_service->getAll($dto);
        return $this->paginatedResponse($gameResults, GameResultResource::class, 'Game results retrieved successfully');
    }

    public function store(CreateGameResultRequest $request): JsonResponse
    {
        $dto = new GameResultDTO($request->validated());
        $gameResult = $this->_service->create($dto);
        return $this->successResponse(new GameResultResource($gameResult), 'Game result created successfully', 201);
    }

    public function getByGameInstanceId(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $gameResult = $this->_service->getByGameInstanceId($user, $id);
        return $this->successResponse(new GameResultResource($gameResult), 'Game result retrieved successfully');
    }
    public function show($id): JsonResponse
    {
        $gameResult = $this->_service->getById($id);
        return $this->successResponse(new GameResultResource($gameResult), 'Game result retrieved successfully');
    }

    public function update(UpdateGameResultRequest $request, $id): JsonResponse
    {
        $dto = new GameResultDTO($request->validated());
        $gameResult = $this->_service->update($id, $dto);
        return $this->successResponse(new GameResultResource($gameResult), 'Game result updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Game result deleted successfully');
    }
}
