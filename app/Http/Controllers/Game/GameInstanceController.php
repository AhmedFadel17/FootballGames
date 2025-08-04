<?php

namespace App\Http\Controllers\Game;

use App\DTOs\Game\GameInstance\GameInstanceDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Game\GameInstance\CreateGameInstanceRequest;
use App\Http\Requests\Game\GameInstance\GameInstanceFilterRequest;
use App\Http\Requests\Game\GameInstance\UpdateGameInstanceRequest;
use App\Services\GameServices\GameInstance\IGameInstanceService;
use Illuminate\Http\JsonResponse;

class GameInstanceController extends Controller
{
    private readonly IGameInstanceService $_service;
    
    public function __construct(IGameInstanceService $service)
    {
        $this->_service = $service;
    }

    public function index(GameInstanceFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $gameInstances = $this->_service->getAll($dto);
        return response()->json($gameInstances->toArray());
    }

    public function store(CreateGameInstanceRequest $request): JsonResponse
    {
        $dto = new GameInstanceDTO($request->validated());
        $gameInstance = $this->_service->create($dto);
        return response()->json($gameInstance, 201);
    }

    public function show($id): JsonResponse
    {
        $gameInstance = $this->_service->getById($id);
        return response()->json($gameInstance);
    }

    public function update(UpdateGameInstanceRequest $request, $id): JsonResponse
    {
        $dto = new GameInstanceDTO($request->validated());
        $gameInstance = $this->_service->update($id, $dto);
        return response()->json($gameInstance);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
} 