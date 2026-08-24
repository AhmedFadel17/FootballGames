<?php

namespace App\Http\Controllers\GameEngine;

use App\DTOs\GameEngine\GameInstanceDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GameEngine\GameInstances\CreateGameInstanceRequest;
use App\Http\Requests\GameEngine\GameInstances\GameInstanceFilterRequest;
use App\Http\Requests\GameEngine\GameInstances\UpdateGameInstanceRequest;
use App\Resources\GameEngine\GameInstanceResource;
use App\Services\GameEngine\GameInstances\IGameInstanceService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameInstanceController extends Controller
{
    use ApiResponses;
    private readonly IGameInstanceService $_service;

    public function __construct(IGameInstanceService $service)
    {
        $this->_service = $service;
    }

    public function index(GameInstanceFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $gameInstances = $this->_service->getAll($dto);
        return $this->paginatedResponse($gameInstances, GameInstanceResource::class, 'Game instances retrieved successfully');
    }

    public function store(CreateGameInstanceRequest $request): JsonResponse
    {
        $dto = new GameInstanceDTO($request->validated());
        $gameInstance = $this->_service->create($dto);
        return $this->successResponse(new GameInstanceResource($gameInstance), 'Game instance created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $gameInstance = $this->_service->getById($id);
        return $this->successResponse(new GameInstanceResource($gameInstance), 'Game instance retrieved successfully');
    }

    public function update(UpdateGameInstanceRequest $request, $id): JsonResponse
    {
        $dto = new GameInstanceDTO($request->validated());
        $gameInstance = $this->_service->update($id, $dto);
        return $this->successResponse(new GameInstanceResource($gameInstance), 'Game instance updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Game instance deleted successfully');
    }

    public function leaveRoom(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $this->_service->leaveRoom($user, $id);
        return $this->successResponse(null, 'Game instance left successfully');
    }
}