<?php

namespace App\Services\Country;

use App\DTOs\Core\Country\CountryDTO;
use App\DTOs\Core\Country\CountryResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Country;
use App\Services\Pagination\IPaginationService;

use function PHPSTORM_META\map;

class CountryService implements ICountryService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['name', 'code','popularity','id'];
        $searchableFields = ['name', 'code'];

        $query = Country::with('continent');

        return $this->_paginationService
            ->paginate($query, $dto, CountryResponseDTO::class, $allowedFilters, $searchableFields,3600);
    }

    public function getAllOptions(): array
    {
        $query = Country::query();
        return $query->get()->map(fn($c) => new CountryResponseDTO($c))->all();
    }


    public function getById($id): CountryResponseDTO
    {
        $country = Country::with('continent')->findOrFail($id);
        return new CountryResponseDTO($country);
    }

    public function create(CountryDTO $data): CountryResponseDTO
    {
        $country = Country::create($data->toArray());
        $country->load('continent');
        return new CountryResponseDTO($country);
    }

    public function update($id, CountryDTO $data): CountryResponseDTO
    {
        $country = Country::findOrFail($id);
        $country->update($data->toArray());
        $country->load('continent');
        return new CountryResponseDTO($country);
    }

    public function delete($id): bool
    {
        $country = Country::findOrFail($id);
        $country->delete();
        return true;
    }
} 