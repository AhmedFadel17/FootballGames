<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\PlayerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Player\CreatePlayerRequest;
use App\Http\Requests\Core\Player\PlayerFilterRequest;
use App\Http\Requests\Core\Player\UpdatePlayerRequest;
use App\Resources\Core\PlayerResource;
use App\Services\Core\Players\IPlayerService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    use ApiResponses;

    private readonly IPlayerService $_service;
    public function __construct(IPlayerService $service)
    {
        $this->_service = $service;
    }

    public function index(PlayerFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $players = $this->_service->getAll($dto);
        return $this->paginatedResponse($players, PlayerResource::class, 'Players retrieved successfully');
    }

    public function store(CreatePlayerRequest $request): JsonResponse
    {
        $dto = PlayerDTO::fromRequest($request);
        $player = $this->_service->create($dto);
        return $this->successResponse(new PlayerResource($player), 'Player created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $player = $this->_service->getById($id);
        return $this->successResponse(new PlayerResource($player), 'Player retrieved successfully');
    }

    public function update(UpdatePlayerRequest $request, $id): JsonResponse
    {
        $dto = PlayerDTO::fromRequest($request);
        $player = $this->_service->update($id, $dto);
        return $this->successResponse(new PlayerResource($player), 'Player updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Player deleted successfully');
    }

}
