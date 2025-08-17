<?php

namespace App\Http\Controllers\Core;

use App\DTOs\Core\Country\CountryDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Core\Country\CreateCountryRequest;
use App\Http\Requests\Core\Country\CountryFilterRequest;
use App\Http\Requests\Core\Country\UpdateCountryRequest;
use App\Services\Country\ICountryService;
use Illuminate\Http\JsonResponse;

class CountryController extends Controller
{
    private readonly ICountryService $_service;
    
    public function __construct(ICountryService $service)
    {
        $this->_service = $service;
    }

    public function index(CountryFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $countries = $this->_service->getAll($dto);
        return response()->json($countries->toArray());
    }

    public function getAllOptions(): JsonResponse
    {
        $countries = $this->_service->getAllOptions();
        return response()->json($countries);
    }

    public function store(CreateCountryRequest $request): JsonResponse
    {
        $dto = new CountryDTO($request->validated());
        $country = $this->_service->create($dto);
        return response()->json($country, 201);
    }

    public function show($id): JsonResponse
    {
        $country = $this->_service->getById($id);
        return response()->json($country);
    }

    public function update(UpdateCountryRequest $request, $id): JsonResponse
    {
        $dto = new CountryDTO($request->validated());
        $country = $this->_service->update($id, $dto);
        return response()->json($country);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
