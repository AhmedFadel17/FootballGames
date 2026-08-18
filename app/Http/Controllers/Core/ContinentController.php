<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\ContinentDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Continent\CreateContinentRequest;
use App\Http\Requests\Core\Continent\ContinentFilterRequest;
use App\Http\Requests\Core\Continent\UpdateContinentRequest;
use App\Resources\Core\ContinentResource;
use App\Services\Core\Continents\IContinentService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;

class ContinentController extends Controller
{
    use ApiResponses;
    private readonly IContinentService $_service;

    public function __construct(IContinentService $service)
    {
        $this->_service = $service;
    }

    public function index(ContinentFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $continents = $this->_service->getAll($dto);
        return $this->paginatedResponse($continents, ContinentResource::class, 'Continents retrieved successfully');
    }

    public function store(CreateContinentRequest $request): JsonResponse
    {
        $dto = ContinentDTO::fromRequest($request);
        $continent = $this->_service->create($dto);
        return $this->successResponse(new ContinentResource($continent), 'Continent created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $continent = $this->_service->getById($id);
        return $this->successResponse(new ContinentResource($continent), 'Continent retrieved successfully');
    }

    public function update(UpdateContinentRequest $request, $id): JsonResponse
    {
        $dto = ContinentDTO::fromRequest($request);
        $continent = $this->_service->update($id, $dto);
        return $this->successResponse(new ContinentResource($continent), 'Continent updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Continent deleted successfully');
    }
}
