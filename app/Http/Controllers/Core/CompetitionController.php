<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\Competition\CompetitionDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Competition\CreateCompetitionRequest;
use App\Http\Requests\Core\Competition\CompetitionFilterRequest;
use App\Http\Requests\Core\Competition\UpdateCompetitionRequest;
use App\Services\Competition\ICompetitionService;
use Illuminate\Http\JsonResponse;

class CompetitionController extends Controller
{
    private readonly ICompetitionService $_service;
    
    public function __construct(ICompetitionService $service)
    {
        $this->_service = $service;
    }

    public function index(CompetitionFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $competitions = $this->_service->getAll($dto);
        return response()->json($competitions->toArray());
    }

    public function store(CreateCompetitionRequest $request): JsonResponse
    {
        $dto = new CompetitionDTO($request->validated());
        $competition = $this->_service->create($dto);
        return response()->json($competition, 201);
    }

    public function show($id): JsonResponse
    {
        $competition = $this->_service->getById($id);
        return response()->json($competition);
    }

    public function update(UpdateCompetitionRequest $request, $id): JsonResponse
    {
        $dto = new CompetitionDTO($request->validated());
        $competition = $this->_service->update($id, $dto);
        return response()->json($competition);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
