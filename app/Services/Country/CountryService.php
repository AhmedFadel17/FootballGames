<?php

namespace App\Services\Country;

use App\DTOs\Core\Country\CountryDTO;
use App\DTOs\Core\Country\CountryResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Country;
use App\Services\Pagination\IPaginationService;

class CountryService implements ICountryService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['continent_id'];
        $searchableFields = ['name', 'code'];

        return $this->_paginationService
            ->paginate(Country::query(), $dto, CountryResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): CountryResponseDTO
    {
        $country = Country::findOrFail($id);
        return new CountryResponseDTO($country);
    }

    public function create(CountryDTO $data): CountryResponseDTO
    {
        $country = Country::create($data->toArray());
        return new CountryResponseDTO($country);
    }

    public function update($id, CountryDTO $data): CountryResponseDTO
    {
        $country = Country::findOrFail($id);
        $country->update($data->toArray());
        return new CountryResponseDTO($country);
    }

    public function delete($id): bool
    {
        $country = Country::findOrFail($id);
        $country->delete();
        return true;
    }
} 