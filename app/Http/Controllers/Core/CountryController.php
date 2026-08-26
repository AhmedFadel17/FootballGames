<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\CountryDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Country\CreateCountryRequest;
use App\Http\Requests\Core\Country\CountryFilterRequest;
use App\Http\Requests\Core\Country\UpdateCountryRequest;
use App\Resources\Core\CountryResource;
use App\Resources\Shared\LookupResource;
use App\Services\Core\Countries\ICountryService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    use ApiResponses;
    private readonly ICountryService $_service;

    public function __construct(ICountryService $service)
    {
        $this->_service = $service;
    }

    public function index(CountryFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $countries = $this->_service->getAll($dto);
        return $this->paginatedResponse($countries, CountryResource::class, 'Countries retrieved successfully');
    }

    public function getOptions(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 10);
        $countries = $this->_service->getOptions($query, $limit);
        return $this->successResponse(
            data: LookupResource::collectionWith(
                resource: $countries,
                valueKey: 'id',
                labelKey: 'name',
                extraFields: ['img_src']
            ),
            message: 'Countries retrieved successfully'
        );
    }

    public function store(CreateCountryRequest $request): JsonResponse
    {
        $dto = CountryDTO::fromRequest($request);
        $country = $this->_service->create($dto);
        return $this->successResponse(new CountryResource($country), 'Country created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $country = $this->_service->getById($id);
        return $this->successResponse(new CountryResource($country), 'Country retrieved successfully');
    }

    public function update(UpdateCountryRequest $request, $id): JsonResponse
    {
        $dto = CountryDTO::fromRequest($request);
        $country = $this->_service->update($id, $dto);
        return $this->successResponse(new CountryResource($country), 'Country updated successfully', 201);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Country deleted successfully');
    }
}
