<?php

namespace App\Services\Core\Countries;

use App\DTOs\Core\CountryDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Country;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CountryService implements ICountryService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Country::query(), $dto)
            ->allowFilters(['id', 'name', 'popularity', 'continent_id'])
            ->allowSorts(['id', 'name', 'popularity', 'continent_id'])
            ->searchable(['name', 'code'])
            ->paginate();
    }

    public function getAllOptions(): Collection
    {
        return Country::query()
            ->select(['id', 'name'])
            ->orderBy('name', 'asc')
            ->get();
    }


    public function getById($id): Country
    {
        $country = Country::with('continent')->findOrFail($id);
        return $country;
    }

    public function create(CountryDTO $data): Country
    {
        $country = Country::create($data->toArray());
        $country->load('continent');
        return $country;
    }

    public function update($id, CountryDTO $data): Country
    {
        $country = Country::findOrFail($id);
        $country->update($data->toUpdateArray());
        $country->load('continent');
        return $country;
    }

    public function delete($id): bool
    {
        $country = Country::findOrFail($id);
        $country->delete();
        return true;
    }
}