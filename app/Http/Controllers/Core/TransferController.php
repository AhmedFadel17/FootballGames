<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\Transfer\TransferDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Transfer\CreateTransferRequest;
use App\Http\Requests\Core\Transfer\TransferFilterRequest;
use App\Http\Requests\Core\Transfer\UpdateTransferRequest;
use App\Services\Transfer\ITransferService;
use Illuminate\Http\JsonResponse;

class TransferController extends Controller
{
    private readonly ITransferService $_service;
    
    public function __construct(ITransferService $service)
    {
        $this->_service = $service;
    }

    public function index(TransferFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $transfers = $this->_service->getAll($dto);
        return response()->json($transfers->toArray());
    }

    public function store(CreateTransferRequest $request): JsonResponse
    {
        $dto = new TransferDTO($request->validated());
        $transfer = $this->_service->create($dto);
        return response()->json($transfer, 201);
    }

    public function show($id): JsonResponse
    {
        $transfer = $this->_service->getById($id);
        return response()->json($transfer);
    }

    public function update(UpdateTransferRequest $request, $id): JsonResponse
    {
        $dto = new TransferDTO($request->validated());
        $transfer = $this->_service->update($id, $dto);
        return response()->json($transfer);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
