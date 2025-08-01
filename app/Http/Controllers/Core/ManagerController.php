<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\Manager\ManagerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Manager\CreateManagerRequest;
use App\Http\Requests\Core\Manager\ManagerFilterRequest;
use App\Http\Requests\Core\Manager\UpdateManagerRequest;
use App\Services\Manager\IManagerService;
use Illuminate\Http\JsonResponse;

class ManagerController extends Controller
{
    private readonly IManagerService $_service;
    
    public function __construct(IManagerService $service)
    {
        $this->_service = $service;
    }

    public function index(ManagerFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $managers = $this->_service->getAll($dto);
        return response()->json($managers->toArray());
    }

    public function store(CreateManagerRequest $request): JsonResponse
    {
        $dto = new ManagerDTO($request->validated());
        $manager = $this->_service->create($dto);
        return response()->json($manager, 201);
    }

    public function show($id): JsonResponse
    {
        $manager = $this->_service->getById($id);
        return response()->json($manager);
    }

    public function update(UpdateManagerRequest $request, $id): JsonResponse
    {
        $dto = new ManagerDTO($request->validated());
        $manager = $this->_service->update($id, $dto);
        return response()->json($manager);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
