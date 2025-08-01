<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\CompetitionPlayerFullStat\CompetitionPlayerFullStatDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\CompetitionPlayerFullStat\CreateCompetitionPlayerFullStatRequest;
use App\Http\Requests\Core\CompetitionPlayerFullStat\CompetitionPlayerFullStatFilterRequest;
use App\Http\Requests\Core\CompetitionPlayerFullStat\UpdateCompetitionPlayerFullStatRequest;
use App\Services\CompetitionPlayerFullStat\ICompetitionPlayerFullStatService;
use Illuminate\Http\JsonResponse;

class CompetitionPlayerFullStatController extends Controller
{
    private readonly ICompetitionPlayerFullStatService $_service;
    
    public function __construct(ICompetitionPlayerFullStatService $service)
    {
        $this->_service = $service;
    }

    public function index(CompetitionPlayerFullStatFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $stats = $this->_service->getAll($dto);
        return response()->json($stats->toArray());
    }

    public function store(CreateCompetitionPlayerFullStatRequest $request): JsonResponse
    {
        $dto = new CompetitionPlayerFullStatDTO($request->validated());
        $stat = $this->_service->create($dto);
        return response()->json($stat, 201);
    }

    public function show($id): JsonResponse
    {
        $stat = $this->_service->getById($id);
        return response()->json($stat);
    }

    public function update(UpdateCompetitionPlayerFullStatRequest $request, $id): JsonResponse
    {
        $dto = new CompetitionPlayerFullStatDTO($request->validated());
        $stat = $this->_service->update($id, $dto);
        return response()->json($stat);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
