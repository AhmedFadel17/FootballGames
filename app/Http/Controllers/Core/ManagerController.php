<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\ManagerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Manager\CreateManagerRequest;
use App\Http\Requests\Core\Manager\ManagerFilterRequest;
use App\Http\Requests\Core\Manager\UpdateManagerRequest;
use App\Resources\Core\ManagerResource;
use App\Resources\Shared\LookupResource;
use App\Services\Core\Managers\IManagerService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ManagerController extends Controller
{
    use ApiResponses;
    private readonly IManagerService $_service;

    public function __construct(IManagerService $service)
    {
        $this->_service = $service;
    }

    public function index(ManagerFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $managers = $this->_service->getAll($dto);
        return $this->paginatedResponse($managers, ManagerResource::class, 'Managers retrieved successfully');
    }

    public function getOptions(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 10);
        $managers = $this->_service->getOptions($query, $limit);
        return $this->successResponse(
            data: LookupResource::collectionWith(
                resource: $managers,
                valueKey: 'id',
                labelKey: 'name',
                extraFields: ['img_src']
            ),
            message: 'Managers retrieved successfully'
        );
    }

    public function store(CreateManagerRequest $request): JsonResponse
    {
        $dto = ManagerDTO::fromRequest($request);
        $manager = $this->_service->create($dto);
        return $this->successResponse(new ManagerResource($manager), 'Manager created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $manager = $this->_service->getById($id);
        return $this->successResponse(new ManagerResource($manager), 'Manager retrieved successfully');
    }

    public function update(UpdateManagerRequest $request, $id): JsonResponse
    {
        $dto = ManagerDTO::fromRequest($request);
        $manager = $this->_service->update($id, $dto);
        return $this->successResponse(new ManagerResource($manager), 'Manager updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Manager deleted successfully');
    }
}
