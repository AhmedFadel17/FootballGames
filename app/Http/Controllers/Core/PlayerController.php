<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\Player\PlayerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Player\CreatePlayerRequest;
use App\Http\Requests\Core\Player\PlayerFilterRequest;
use App\Http\Requests\Core\Player\UpdatePlayerRequest;
use App\Services\Player\IPlayerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    private readonly IPlayerService $_service;
    public function __construct(IPlayerService $service)
    {
        $this->_service = $service;
    }

    public function index(PlayerFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $players = $this->_service->getAll($dto);
        return response()->json($players->toArray());
    }

    public function store(CreatePlayerRequest $request): JsonResponse
    {
        $dto = new PlayerDTO($request->validated());
        $player = $this->_service->create($dto);
        return response()->json($player, 201);
    }

    public function show($id): JsonResponse
    {
        $player = $this->_service->getById($id);
        return response()->json($player);
    }

    public function update(UpdatePlayerRequest $request, $id): JsonResponse
    {
        $dto = new PlayerDTO($request->validated());
        $player = $this->_service->update($id, $dto);
        return response()->json($player);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
