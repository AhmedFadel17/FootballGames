<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\PlayerTeamPeriod\PlayerTeamPeriodDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\PlayerTeamPeriod\CreatePlayerTeamPeriodRequest;
use App\Http\Requests\Core\PlayerTeamPeriod\PlayerTeamPeriodFilterRequest;
use App\Http\Requests\Core\PlayerTeamPeriod\UpdatePlayerTeamPeriodRequest;
use App\Services\PlayerTeamPeriod\IPlayerTeamPeriodService;
use Illuminate\Http\JsonResponse;

class PlayerTeamPeriodController extends Controller
{
    private readonly IPlayerTeamPeriodService $_service;
    
    public function __construct(IPlayerTeamPeriodService $service)
    {
        $this->_service = $service;
    }

    public function index(PlayerTeamPeriodFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $periods = $this->_service->getAll($dto);
        return response()->json($periods->toArray());
    }

    public function store(CreatePlayerTeamPeriodRequest $request): JsonResponse
    {
        $dto = new PlayerTeamPeriodDTO($request->validated());
        $period = $this->_service->create($dto);
        return response()->json($period, 201);
    }

    public function show($id): JsonResponse
    {
        $period = $this->_service->getById($id);
        return response()->json($period);
    }

    public function update(UpdatePlayerTeamPeriodRequest $request, $id): JsonResponse
    {
        $dto = new PlayerTeamPeriodDTO($request->validated());
        $period = $this->_service->update($id, $dto);
        return response()->json($period);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
