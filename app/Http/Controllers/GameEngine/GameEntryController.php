<?php

namespace App\Http\Controllers\GameEngine;

use App\DTOs\GameEngine\GameEntryDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GameEngine\GameEntries\CreateGameEntryRequest;
use App\Http\Requests\GameEngine\GameEntries\GameEntryFilterRequest;
use App\Http\Requests\GameEngine\GameEntries\UpdateGameEntryRequest;
use App\Resources\GameEngine\GameEntryResource;
use App\Services\GameEngine\GameEntries\IGameEntryService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;

class GameEntryController extends Controller
{
    use ApiResponses;
    private readonly IGameEntryService $_service;

    public function __construct(IGameEntryService $service)
    {
        $this->_service = $service;
    }

    public function index(GameEntryFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $gameEntries = $this->_service->getAll($dto);
        return $this->paginatedResponse($gameEntries, GameEntryResource::class, 'Game entries retrieved successfully');
    }

    public function store(CreateGameEntryRequest $request): JsonResponse
    {
        $dto = new GameEntryDTO($request->validated());
        $gameEntry = $this->_service->create($dto);
        return $this->successResponse(new GameEntryResource($gameEntry), 'Game entry created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $gameEntry = $this->_service->getById($id);
        return $this->successResponse(new GameEntryResource($gameEntry), 'Game entry retrieved successfully');
    }

    public function update(UpdateGameEntryRequest $request, $id): JsonResponse
    {
        $dto = new GameEntryDTO($request->validated());
        $gameEntry = $this->_service->update($id, $dto);
        return $this->successResponse(new GameEntryResource($gameEntry), 'Game entry updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Game entry deleted successfully');
    }
}