<?php

namespace App\Http\Controllers\Packs;

use App\DTOs\Packs\PackDropRuleDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Packs\PackDropRule\PackDropRuleFilterRequest;
use App\Http\Requests\Packs\PackDropRule\StorePackDropRuleRequest;
use App\Http\Requests\Packs\PackDropRule\UpdatePackDropRuleRequest;
use App\Resources\Packs\PackDropRuleResource;
use App\Services\Packs\PackDropRules\IPackDropRuleService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;

class PackDropRuleController extends Controller
{
    use ApiResponses;

    private readonly IPackDropRuleService $_service;

    public function __construct(IPackDropRuleService $service)
    {
        $this->_service = $service;
    }

    public function index(PackDropRuleFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $rules = $this->_service->getAll($dto);
        return $this->paginatedResponse($rules, PackDropRuleResource::class, 'Pack drop rules retrieved successfully');
    }

    public function store(StorePackDropRuleRequest $request): JsonResponse
    {
        $dto = PackDropRuleDTO::fromRequest($request);
        $rule = $this->_service->create($dto);
        return $this->successResponse(new PackDropRuleResource($rule), 'Pack drop rule created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $rule = $this->_service->getById($id);
        return $this->successResponse(new PackDropRuleResource($rule), 'Pack drop rule retrieved successfully');
    }

    public function update(UpdatePackDropRuleRequest $request, $id): JsonResponse
    {
        $dto = PackDropRuleDTO::fromRequest($request);
        $rule = $this->_service->update($id, $dto);
        return $this->successResponse(new PackDropRuleResource($rule), 'Pack drop rule updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Pack drop rule deleted successfully');
    }
}
