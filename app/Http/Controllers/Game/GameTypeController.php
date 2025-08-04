<?php

namespace App\Http\Controllers\Game;

use App\DTOs\Game\GameType\GameTypeDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Game\GameType\CreateGameTypeRequest;
use App\Http\Requests\Game\GameType\UpdateGameTypeRequest;
use App\Services\GameServices\GameType\IGameTypeService;
use Illuminate\Http\JsonResponse;

class GameTypeController extends Controller
{
    private readonly IGameTypeService $_service;
    
    public function __construct(IGameTypeService $service)
    {
        $this->_service = $service;
    }

    public function index(): JsonResponse
    {
        $gameTypes = $this->_service->getAll();
        return response()->json($gameTypes);
    }

    public function store(CreateGameTypeRequest $request): JsonResponse
    {
        $dto = new GameTypeDTO($request->validated());
        $gameType = $this->_service->create($dto);
        return response()->json($gameType, 201);
    }

    public function show($id): JsonResponse
    {
        $gameType = $this->_service->getById($id);
        return response()->json($gameType);
    }

    public function update(UpdateGameTypeRequest $request, $id): JsonResponse
    {
        $dto = new GameTypeDTO($request->validated());
        $gameType = $this->_service->update($id, $dto);
        return response()->json($gameType);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
} 