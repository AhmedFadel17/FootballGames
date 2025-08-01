<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\ManagerTeamPeriod\ManagerTeamPeriodDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\ManagerTeamPeriod\CreateManagerTeamPeriodRequest;
use App\Http\Requests\Core\ManagerTeamPeriod\ManagerTeamPeriodFilterRequest;
use App\Http\Requests\Core\ManagerTeamPeriod\UpdateManagerTeamPeriodRequest;
use App\Services\ManagerTeamPeriod\IManagerTeamPeriodService;
use Illuminate\Http\JsonResponse;

class ManagerTeamPeriodController extends Controller
{
    private readonly IManagerTeamPeriodService $_service;
    
    public function __construct(IManagerTeamPeriodService $service)
    {
        $this->_service = $service;
    }

    public function index(ManagerTeamPeriodFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $periods = $this->_service->getAll($dto);
        return response()->json($periods->toArray());
    }

    public function store(CreateManagerTeamPeriodRequest $request): JsonResponse
    {
        $dto = new ManagerTeamPeriodDTO($request->validated());
        $period = $this->_service->create($dto);
        return response()->json($period, 201);
    }

    public function show($id): JsonResponse
    {
        $period = $this->_service->getById($id);
        return response()->json($period);
    }

    public function update(UpdateManagerTeamPeriodRequest $request, $id): JsonResponse
    {
        $dto = new ManagerTeamPeriodDTO($request->validated());
        $period = $this->_service->update($id, $dto);
        return response()->json($period);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
