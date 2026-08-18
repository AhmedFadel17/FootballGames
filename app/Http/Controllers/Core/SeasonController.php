<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\SeasonDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Season\CreateSeasonRequest;
use App\Http\Requests\Core\Season\SeasonFilterRequest;
use App\Http\Requests\Core\Season\UpdateSeasonRequest;
use App\Resources\Core\SeasonResource;
use App\Services\Core\Seasons\ISeasonService;
use Illuminate\Http\JsonResponse;
use App\Traits\ApiResponses;

class SeasonController extends Controller
{
    use ApiResponses;

    private readonly ISeasonService $_service;

    public function __construct(ISeasonService $service)
    {
        $this->_service = $service;
    }

    public function index(SeasonFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $seasons = $this->_service->getAll($dto);
        return $this->paginatedResponse($seasons, SeasonResource::class, 'Seasons retrieved successfully');
    }

    public function store(CreateSeasonRequest $request): JsonResponse
    {
        $dto = SeasonDTO::fromRequest($request);
        $season = $this->_service->create($dto);
        return $this->successResponse(new SeasonResource($season), 'Season created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $season = $this->_service->getById($id);
        return $this->successResponse(new SeasonResource($season), 'Season retrieved successfully');
    }

    public function update(UpdateSeasonRequest $request, $id): JsonResponse
    {
        $dto = SeasonDTO::fromRequest($request);
        $season = $this->_service->update($id, $dto);
        return $this->successResponse(new SeasonResource($season), 'Season updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Season deleted successfully');
    }
}
