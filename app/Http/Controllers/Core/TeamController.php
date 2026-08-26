<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\TeamDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Team\CreateTeamRequest;
use App\Http\Requests\Core\Team\TeamFilterRequest;
use App\Http\Requests\Core\Team\UpdateTeamRequest;
use App\Resources\Core\TeamResource;
use App\Resources\Shared\LookupResource;
use App\Services\Core\Teams\ITeamService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    use ApiResponses;
    private readonly ITeamService $_service;

    public function __construct(ITeamService $service)
    {
        $this->_service = $service;
    }

    public function index(TeamFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $teams = $this->_service->getAll($dto);
        return $this->paginatedResponse($teams, TeamResource::class, 'Teams retrieved successfully');
    }

    public function getOptions(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 10);
        $teams = $this->_service->getOptions($query, $limit);
        return $this->successResponse(
            data: LookupResource::collectionWith(
                resource: $teams,
                valueKey: 'id',
                labelKey: 'name',
                extraFields: ['img_src']
            ),
            message: 'Teams retrieved successfully'
        );
    }

    public function store(CreateTeamRequest $request): JsonResponse
    {
        $dto = TeamDTO::fromRequest($request);
        $team = $this->_service->create($dto);
        return $this->successResponse(new TeamResource($team), 'Team created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $team = $this->_service->getById($id);
        return $this->successResponse(new TeamResource($team), 'Team retrieved successfully');
    }

    public function update(UpdateTeamRequest $request, $id): JsonResponse
    {
        $dto = TeamDTO::fromRequest($request);
        $team = $this->_service->update($id, $dto);
        return $this->successResponse(new TeamResource($team), 'Team updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Team deleted successfully');
    }
}
