<?php

namespace App\Http\Controllers\Game;

use App\DTOs\Game\GameResult\GameResultDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Game\GameResult\CreateGameResultRequest;
use App\Http\Requests\Game\GameResult\GameResultFilterRequest;
use App\Http\Requests\Game\GameResult\UpdateGameResultRequest;
use App\Services\GameServices\GameResult\IGameResultService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameResultController extends Controller
{
    private readonly IGameResultService $_service;

    public function __construct(IGameResultService $service)
    {
        $this->_service = $service;
    }

    public function index(GameResultFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $gameResults = $this->_service->getAll($dto);
        return response()->json($gameResults->toArray());
    }

    public function store(CreateGameResultRequest $request): JsonResponse
    {
        $dto = new GameResultDTO($request->validated());
        $gameResult = $this->_service->create($dto);
        return response()->json($gameResult, 201);
    }

    public function getByGameInstanceId(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $gameResult = $this->_service->getByGameInstanceId($user, $id);
        return response()->json($gameResult);
    }
    public function show($id): JsonResponse
    {
        $gameResult = $this->_service->getById($id);
        return response()->json($gameResult);
    }

    public function update(UpdateGameResultRequest $request, $id): JsonResponse
    {
        $dto = new GameResultDTO($request->validated());
        $gameResult = $this->_service->update($id, $dto);
        return response()->json($gameResult);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
