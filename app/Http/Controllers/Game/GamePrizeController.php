<?php

namespace App\Http\Controllers\Game;

use App\DTOs\Game\GamePrize\GamePrizeDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Game\GamePrize\CreateGamePrizeRequest;
use App\Http\Requests\Game\GamePrize\GamePrizeFilterRequest;
use App\Http\Requests\Game\GamePrize\UpdateGamePrizeRequest;
use App\Services\GameServices\GamePrize\IGamePrizeService;
use Illuminate\Http\JsonResponse;

class GamePrizeController extends Controller
{
    private readonly IGamePrizeService $_service;
    
    public function __construct(IGamePrizeService $service)
    {
        $this->_service = $service;
    }

    public function index(GamePrizeFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $gamePrizes = $this->_service->getAll($dto);
        return response()->json($gamePrizes->toArray());
    }

    public function store(CreateGamePrizeRequest $request): JsonResponse
    {
        $dto = new GamePrizeDTO($request->validated());
        $gamePrize = $this->_service->create($dto);
        return response()->json($gamePrize, 201);
    }

    public function show($id): JsonResponse
    {
        $gamePrize = $this->_service->getById($id);
        return response()->json($gamePrize);
    }

    public function update(UpdateGamePrizeRequest $request, $id): JsonResponse
    {
        $dto = new GamePrizeDTO($request->validated());
        $gamePrize = $this->_service->update($id, $dto);
        return response()->json($gamePrize);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
} 