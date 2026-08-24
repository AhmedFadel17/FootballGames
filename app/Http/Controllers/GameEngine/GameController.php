<?php

namespace App\Http\Controllers\GameEngine;

use App\DTOs\GameEngine\GameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GameEngine\Games\CreateGameRequest;
use App\Http\Requests\GameEngine\Games\GameFilterRequest;
use App\Http\Requests\GameEngine\Games\UpdateGameRequest;
use App\Resources\GameEngine\GameResource;
use App\Services\GameEngine\Games\IGameService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;

class GameController extends Controller
{
    use ApiResponses;

    private readonly IGameService $_service;

    public function __construct(IGameService $service)
    {
        $this->_service = $service;
    }

    public function index(GameFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $games = $this->_service->getAll($dto);
        return $this->paginatedResponse($games, GameResource::class, 'Games retrieved successfully');
    }

    public function store(CreateGameRequest $request): JsonResponse
    {
        $dto = GameDTO::fromRequest($request);
        $game = $this->_service->create($dto);
        return $this->successResponse(new GameResource($game), 'Game created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $game = $this->_service->getById($id);
        return $this->successResponse(new GameResource($game), 'Game retrieved successfully');
    }

    public function update(UpdateGameRequest $request, $id): JsonResponse
    {
        $dto = GameDTO::fromRequest($request);
        $game = $this->_service->update($id, $dto);
        return $this->successResponse(new GameResource($game), 'Game updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Game deleted successfully');
    }
}