<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\CompetitionSeasonDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\CompetitionSeason\CreateCompetitionSeasonRequest;
use App\Http\Requests\Core\CompetitionSeason\CompetitionSeasonFilterRequest;
use App\Http\Requests\Core\CompetitionSeason\UpdateCompetitionSeasonRequest;
use App\Resources\Core\CompetitionSeasonResource;
use App\Resources\Core\StandingResource;
use App\Services\Core\CompetitionSeasons\ICompetitionSeasonService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;

class CompetitionSeasonController extends Controller
{
    use ApiResponses;

    private readonly ICompetitionSeasonService $_service;

    public function __construct(ICompetitionSeasonService $service)
    {
        $this->_service = $service;
    }

    public function index(CompetitionSeasonFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $competitions = $this->_service->getAll($dto);
        return $this->paginatedResponse($competitions, CompetitionSeasonResource::class, 'Competitions retrieved successfully');
    }

    public function store(CreateCompetitionSeasonRequest $request): JsonResponse
    {
        $dto = CompetitionSeasonDTO::fromRequest($request);
        $competition = $this->_service->create($dto);
        return $this->successResponse(new CompetitionSeasonResource($competition), 'Competition season created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $competition = $this->_service->getById($id);
        return $this->successResponse(new CompetitionSeasonResource($competition), 'Competition season retrieved successfully');
    }

    public function getStandings($id): JsonResponse
    {
        $standings = $this->_service->getStandingsBySeasonId($id);
        return $this->successResponse(StandingResource::collection($standings), 'Standings retrieved successfully');
    }

    public function update(UpdateCompetitionSeasonRequest $request, $id): JsonResponse
    {
        $dto = CompetitionSeasonDTO::fromRequest($request);
        $competition = $this->_service->update($id, $dto);
        return $this->successResponse(new CompetitionSeasonResource($competition), 'Competition season updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Competition season deleted successfully');
    }
}
