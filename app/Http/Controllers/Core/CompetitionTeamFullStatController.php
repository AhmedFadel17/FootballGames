<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\CompetitionTeamFullStat\CompetitionTeamFullStatDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\CompetitionTeamFullStat\CreateCompetitionTeamFullStatRequest;
use App\Http\Requests\Core\CompetitionTeamFullStat\CompetitionTeamFullStatFilterRequest;
use App\Http\Requests\Core\CompetitionTeamFullStat\UpdateCompetitionTeamFullStatRequest;
use App\Services\CompetitionTeamFullStat\ICompetitionTeamFullStatService;
use Illuminate\Http\JsonResponse;

class CompetitionTeamFullStatController extends Controller
{
    private readonly ICompetitionTeamFullStatService $_service;
    
    public function __construct(ICompetitionTeamFullStatService $service)
    {
        $this->_service = $service;
    }

    public function index(CompetitionTeamFullStatFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $stats = $this->_service->getAll($dto);
        return response()->json($stats->toArray());
    }

    public function store(CreateCompetitionTeamFullStatRequest $request): JsonResponse
    {
        $dto = new CompetitionTeamFullStatDTO($request->validated());
        $stat = $this->_service->create($dto);
        return response()->json($stat, 201);
    }

    public function show($id): JsonResponse
    {
        $stat = $this->_service->getById($id);
        return response()->json($stat);
    }

    public function update(UpdateCompetitionTeamFullStatRequest $request, $id): JsonResponse
    {
        $dto = new CompetitionTeamFullStatDTO($request->validated());
        $stat = $this->_service->update($id, $dto);
        return response()->json($stat);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
