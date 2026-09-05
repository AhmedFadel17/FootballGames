<?php

namespace App\Http\Controllers\Packs;

use App\DTOs\Packs\OpenPackRequestDTO;
use App\DTOs\Packs\PackDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Packs\OpenPackRequest;
use App\Http\Requests\Packs\Pack\PackFilterRequest;
use App\Http\Requests\Packs\Pack\StorePackRequest;
use App\Http\Requests\Packs\Pack\UpdatePackRequest;
use App\Resources\Packs\PackOpeningResource;
use App\Resources\Packs\PackResource;
use App\Resources\Shared\LookupResource;
use App\Services\Packs\Packs\IPackService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackController extends Controller
{
    use ApiResponses;

    private readonly IPackService $_service;

    public function __construct(IPackService $service)
    {
        $this->_service = $service;
    }

    public function index(PackFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $packs = $this->_service->getAll($dto);
        return $this->paginatedResponse($packs, PackResource::class, 'Packs retrieved successfully');
    }

    public function getOptions(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 10);
        $packs = $this->_service->getOptions($query, $limit);
        return $this->successResponse(
            data: LookupResource::collectionWith(
                resource: $packs,
                valueKey: 'id',
                labelKey: 'name',
                extraFields: ['price_coins', 'cards_count', 'img_src']
            ),
            message: 'Packs options retrieved successfully'
        );
    }

    public function store(StorePackRequest $request): JsonResponse
    {
        $dto = PackDTO::fromRequest($request);
        $pack = $this->_service->create($dto);
        return $this->successResponse(new PackResource($pack), 'Pack created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $pack = $this->_service->getById($id);
        return $this->successResponse(new PackResource($pack), 'Pack retrieved successfully');
    }

    public function update(UpdatePackRequest $request, $id): JsonResponse
    {
        $dto = PackDTO::fromRequest($request);
        $pack = $this->_service->update($id, $dto);
        return $this->successResponse(new PackResource($pack), 'Pack updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Pack deleted successfully');
    }

    public function open(OpenPackRequest $request): JsonResponse
    {
        $dto = OpenPackRequestDTO::fromRequest($request);
        $result = $this->_service->openPack($dto);
        return $this->successResponse(new PackOpeningResource($result), 'Pack opened successfully');
    }
}