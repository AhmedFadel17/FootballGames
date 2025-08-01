<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\CompetitionParticipant\CompetitionParticipantDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\CompetitionParticipant\CreateCompetitionParticipantRequest;
use App\Http\Requests\Core\CompetitionParticipant\CompetitionParticipantFilterRequest;
use App\Http\Requests\Core\CompetitionParticipant\UpdateCompetitionParticipantRequest;
use App\Services\CompetitionParticipant\ICompetitionParticipantService;
use Illuminate\Http\JsonResponse;

class CompetitionParticipantController extends Controller
{
    private readonly ICompetitionParticipantService $_service;
    
    public function __construct(ICompetitionParticipantService $service)
    {
        $this->_service = $service;
    }

    public function index(CompetitionParticipantFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $participants = $this->_service->getAll($dto);
        return response()->json($participants->toArray());
    }

    public function store(CreateCompetitionParticipantRequest $request): JsonResponse
    {
        $dto = new CompetitionParticipantDTO($request->validated());
        $participant = $this->_service->create($dto);
        return response()->json($participant, 201);
    }

    public function show($id): JsonResponse
    {
        $participant = $this->_service->getById($id);
        return response()->json($participant);
    }

    public function update(UpdateCompetitionParticipantRequest $request, $id): JsonResponse
    {
        $dto = new CompetitionParticipantDTO($request->validated());
        $participant = $this->_service->update($id, $dto);
        return response()->json($participant);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
