<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\Continent\ContinentDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Continent\CreateContinentRequest;
use App\Http\Requests\Core\Continent\ContinentFilterRequest;
use App\Http\Requests\Core\Continent\UpdateContinentRequest;
use App\Services\Continent\IContinentService;
use Illuminate\Http\JsonResponse;

class ContinentController extends Controller
{
    private readonly IContinentService $_service;
    
    public function __construct(IContinentService $service)
    {
        $this->_service = $service;
    }

    public function index(ContinentFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $continents = $this->_service->getAll($dto);
        return response()->json($continents->toArray());
    }

    public function store(CreateContinentRequest $request): JsonResponse
    {
        $dto = new ContinentDTO($request->validated());
        $continent = $this->_service->create($dto);
        return response()->json($continent, 201);
    }

    public function show($id): JsonResponse
    {
        $continent = $this->_service->getById($id);
        return response()->json($continent);
    }

    public function update(UpdateContinentRequest $request, $id): JsonResponse
    {
        $dto = new ContinentDTO($request->validated());
        $continent = $this->_service->update($id, $dto);
        return response()->json($continent);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
