<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\CompetitionDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Competition\CreateCompetitionRequest;
use App\Http\Requests\Core\Competition\CompetitionFilterRequest;
use App\Http\Requests\Core\Competition\UpdateCompetitionRequest;
use App\Http\Requests\Core\Team\TeamFilterRequest;
use App\Http\Requests\Shared\BaseFilterRequest;
use App\Resources\Core\CompetitionResource;
use App\Resources\Core\TeamResource;
use App\Resources\Shared\LookupResource;
use App\Services\Core\Competitions\ICompetitionService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompetitionController extends Controller
{
    use ApiResponses;

    private readonly ICompetitionService $_service;

    public function __construct(ICompetitionService $service)
    {
        $this->_service = $service;
    }

    public function index(CompetitionFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $competitions = $this->_service->getAll($dto);
        return $this->paginatedResponse($competitions, CompetitionResource::class, 'Competitions retrieved successfully');
    }

    public function getOptions(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 10);
        $competitions = $this->_service->getOptions($query, $limit);
        return $this->successResponse(
            data: LookupResource::collectionWith(
                resource: $competitions,
                valueKey: 'id',
                labelKey: 'name',
                extraFields: ['img_src']
            ),
            message: 'Competitions retrieved successfully'
        );
    }

    public function store(CreateCompetitionRequest $request): JsonResponse
    {
        $dto = CompetitionDTO::fromRequest($request);
        $competition = $this->_service->create($dto);
        return $this->successResponse(new CompetitionResource($competition), 'Competition created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $competition = $this->_service->getById($id);
        return $this->successResponse(new CompetitionResource($competition), 'Competition retrieved successfully');
    }

    public function getTeams(TeamFilterRequest $request, $id): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $teams = $this->_service->getTeamsByCompetitionId($id, $dto);
        return $this->paginatedResponse($teams, TeamResource::class, 'Competition teams retrieved successfully');
    }

    public function update(UpdateCompetitionRequest $request, $id): JsonResponse
    {
        $dto = CompetitionDTO::fromRequest($request);
        $competition = $this->_service->update($id, $dto);
        return $this->successResponse(new CompetitionResource($competition), 'Competition updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Competition deleted successfully');
    }
}
