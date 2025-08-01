<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\Season\SeasonDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Season\CreateSeasonRequest;
use App\Http\Requests\Core\Season\SeasonFilterRequest;
use App\Http\Requests\Core\Season\UpdateSeasonRequest;
use App\Services\Season\ISeasonService;
use Illuminate\Http\JsonResponse;

class SeasonController extends Controller
{
    private readonly ISeasonService $_service;
    
    public function __construct(ISeasonService $service)
    {
        $this->_service = $service;
    }

    public function index(SeasonFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $seasons = $this->_service->getAll($dto);
        return response()->json($seasons->toArray());
    }

    public function store(CreateSeasonRequest $request): JsonResponse
    {
        $dto = new SeasonDTO($request->validated());
        $season = $this->_service->create($dto);
        return response()->json($season, 201);
    }

    public function show($id): JsonResponse
    {
        $season = $this->_service->getById($id);
        return response()->json($season);
    }

    public function update(UpdateSeasonRequest $request, $id): JsonResponse
    {
        $dto = new SeasonDTO($request->validated());
        $season = $this->_service->update($id, $dto);
        return response()->json($season);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
