<?php

namespace App\Http\Controllers\Game;

use App\DTOs\Game\GameEntry\GameEntryDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Game\GameEntry\CreateGameEntryRequest;
use App\Http\Requests\Game\GameEntry\GameEntryFilterRequest;
use App\Http\Requests\Game\GameEntry\UpdateGameEntryRequest;
use App\Services\GameServices\GameEntry\IGameEntryService;
use Illuminate\Http\JsonResponse;

class GameEntryController extends Controller
{
    private readonly IGameEntryService $_service;
    
    public function __construct(IGameEntryService $service)
    {
        $this->_service = $service;
    }

    public function index(GameEntryFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $gameEntries = $this->_service->getAll($dto);
        return response()->json($gameEntries->toArray());
    }

    public function store(CreateGameEntryRequest $request): JsonResponse
    {
        $dto = new GameEntryDTO($request->validated());
        $gameEntry = $this->_service->create($dto);
        return response()->json($gameEntry, 201);
    }

    public function show($id): JsonResponse
    {
        $gameEntry = $this->_service->getById($id);
        return response()->json($gameEntry);
    }

    public function update(UpdateGameEntryRequest $request, $id): JsonResponse
    {
        $dto = new GameEntryDTO($request->validated());
        $gameEntry = $this->_service->update($id, $dto);
        return response()->json($gameEntry);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
} 