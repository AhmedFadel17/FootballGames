<?php
namespace App\Http\Controllers\Packs;

use App\DTOs\Packs\PowerupDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Packs\Powerup\PowerupFilterRequest;
use App\Http\Requests\Packs\Powerup\StorePowerupRequest;
use App\Http\Requests\Packs\Powerup\UpdatePowerupRequest;
use App\Resources\Packs\PowerupResource;
use App\Resources\Shared\LookupResource;
use App\Services\Packs\Powerups\IPowerupService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PowerupController extends Controller
{
    use ApiResponses;

    private readonly IPowerupService $_service;

    public function __construct(IPowerupService $service)
    {
        $this->_service = $service;
    }

    public function index(PowerupFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $powerups = $this->_service->getAll($dto);
        return $this->paginatedResponse($powerups, PowerupResource::class, 'Powerups retrieved successfully');
    }

    public function getOptions(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 10);
        $powerups = $this->_service->getOptions($query, $limit);
        return $this->successResponse(
            data: LookupResource::collectionWith(
                resource: $powerups,
                valueKey: 'id',
                labelKey: 'name',
                extraFields: ['slug', 'icon_src']
            ),
            message: 'Powerups options retrieved successfully'
        );
    }

    public function store(StorePowerupRequest $request): JsonResponse
    {
        $dto = PowerupDTO::fromRequest($request);
        $powerup = $this->_service->create($dto);
        return $this->successResponse(new PowerupResource($powerup), 'Powerup created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $powerup = $this->_service->getById($id);
        return $this->successResponse(new PowerupResource($powerup), 'Powerup retrieved successfully');
    }

    public function update(UpdatePowerupRequest $request, $id): JsonResponse
    {
        $dto = PowerupDTO::fromRequest($request);
        $powerup = $this->_service->update($id, $dto);
        return $this->successResponse(new PowerupResource($powerup), 'Powerup updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Powerup deleted successfully');
    }
}