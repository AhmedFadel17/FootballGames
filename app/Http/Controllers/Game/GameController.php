<?php

namespace App\Http\Controllers\Game;

use App\DTOs\Game\Game\GameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Game\Game\CreateGameRequest;
use App\Http\Requests\Game\Game\GameFilterRequest;
use App\Http\Requests\Game\Game\UpdateGameRequest;
use App\Services\GameServices\Game\IGameService;
use Illuminate\Http\JsonResponse;

class GameController extends Controller
{
    private readonly IGameService $_service;
    
    public function __construct(IGameService $service)
    {
        $this->_service = $service;
    }

    public function index(GameFilterRequest $request): JsonResponse
    {
        $dto = $request->validated();
        $games = $this->_service->getAll($dto);
        return response()->json($games);
    }

    public function store(CreateGameRequest $request): JsonResponse
    {
        $dto = GameDTO::fromRequest($request);
        $game = $this->_service->create($dto);
        return response()->json($game, 201);
    }

    public function show($id): JsonResponse
    {
        $game = $this->_service->getById($id);
        return response()->json($game);
    }

    public function update(UpdateGameRequest $request, $id): JsonResponse
    {
        $dto = GameDTO::fromRequest($request);
        $game = $this->_service->update($id, $dto);
        return response()->json($game);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
} 