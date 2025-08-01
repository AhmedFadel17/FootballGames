<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\Team\TeamDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Team\CreateTeamRequest;
use App\Http\Requests\Core\Team\TeamFilterRequest;
use App\Http\Requests\Core\Team\UpdateTeamRequest;
use App\Services\Team\ITeamService;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    private readonly ITeamService $_service;
    
    public function __construct(ITeamService $service)
    {
        $this->_service = $service;
    }

    public function index(TeamFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $teams = $this->_service->getAll($dto);
        return response()->json($teams->toArray());
    }

    public function store(CreateTeamRequest $request): JsonResponse
    {
        $dto = new TeamDTO($request->validated());
        $team = $this->_service->create($dto);
        return response()->json($team, 201);
    }

    public function show($id): JsonResponse
    {
        $team = $this->_service->getById($id);
        return response()->json($team);
    }

    public function update(UpdateTeamRequest $request, $id): JsonResponse
    {
        $dto = new TeamDTO($request->validated());
        $team = $this->_service->update($id, $dto);
        return response()->json($team);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
