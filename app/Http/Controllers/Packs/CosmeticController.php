<?php
namespace App\Http\Controllers\Packs\Cosmetic;

use App\DTOs\Packs\CosmeticDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Packs\Cosmetic\CosmeticFilterRequest;
use App\Http\Requests\Packs\Cosmetic\StoreCosmeticRequest;
use App\Http\Requests\Packs\Cosmetic\UpdateCosmeticRequest;
use App\Resources\Packs\CosmeticResource;
use App\Resources\Shared\LookupResource;
use App\Services\Packs\Cosmetics\ICosmeticService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CosmeticController extends Controller
{
    use ApiResponses;

    private readonly ICosmeticService $_service;

    public function __construct(ICosmeticService $service)
    {
        $this->_service = $service;
    }

    public function index(CosmeticFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $cosmetics = $this->_service->getAll($dto);
        return $this->paginatedResponse($cosmetics, CosmeticResource::class, 'Cosmetics retrieved successfully');
    }

    public function getOptions(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 10);
        $cosmetics = $this->_service->getOptions($query, $limit);
        return $this->successResponse(
            data: LookupResource::collectionWith(
                resource: $cosmetics,
                valueKey: 'id',
                labelKey: 'name',
                extraFields: ['type', 'img_src', 'rarity']
            ),
            message: 'Cosmetics options retrieved successfully'
        );
    }

    public function store(StoreCosmeticRequest $request): JsonResponse
    {
        $dto = CosmeticDTO::fromRequest($request);
        $cosmetic = $this->_service->create($dto);
        return $this->successResponse(new CosmeticResource($cosmetic), 'Cosmetic created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $cosmetic = $this->_service->getById($id);
        return $this->successResponse(new CosmeticResource($cosmetic), 'Cosmetic retrieved successfully');
    }

    public function update(UpdateCosmeticRequest $request, $id): JsonResponse
    {
        $dto = CosmeticDTO::fromRequest($request);
        $cosmetic = $this->_service->update($id, $dto);
        return $this->successResponse(new CosmeticResource($cosmetic), 'Cosmetic updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Cosmetic deleted successfully');
    }
}