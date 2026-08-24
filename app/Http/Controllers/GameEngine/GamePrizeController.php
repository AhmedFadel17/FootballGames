<?php

namespace App\Http\Controllers\GameEngine;

use App\DTOs\GameEngine\GamePrizeDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GameEngine\GamePrizes\CreateGamePrizeRequest;
use App\Http\Requests\GameEngine\GamePrizes\GamePrizeFilterRequest;
use App\Http\Requests\GameEngine\GamePrizes\UpdateGamePrizeRequest;
use App\Services\GameEngine\GamePrizes\IGamePrizeService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use App\Resources\GameEngine\GamePrizeResource;
class GamePrizeController extends Controller
{
    use ApiResponses;
    private readonly IGamePrizeService $_service;

    public function __construct(IGamePrizeService $service)
    {
        $this->_service = $service;
    }

    public function index(GamePrizeFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $gamePrizes = $this->_service->getAll($dto);
        return $this->paginatedResponse($gamePrizes, GamePrizeResource::class, 'Game prizes retrieved successfully');
    }

    public function store(CreateGamePrizeRequest $request): JsonResponse
    {
        $dto = new GamePrizeDTO($request->validated());
        $gamePrize = $this->_service->create($dto);
        return $this->successResponse(new GamePrizeResource($gamePrize), 'Game prize created successfully', 201);
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
        return $this->successResponse(new GamePrizeResource($gamePrize), 'Game prize updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Game prize deleted successfully');
    }
}