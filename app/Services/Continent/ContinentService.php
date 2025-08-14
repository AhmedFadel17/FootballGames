<?php

namespace App\Services\Continent;

use App\DTOs\Core\Continent\ContinentDTO;
use App\DTOs\Core\Continent\ContinentResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Continent;
use App\Services\Pagination\IPaginationService;

class ContinentService implements IContinentService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['name', 'code','id'];
        $searchableFields = ['name', 'code'];

        return $this->_paginationService
            ->paginate(Continent::query(), $dto, ContinentResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): ContinentResponseDTO
    {
        $continent = Continent::findOrFail($id);
        return new ContinentResponseDTO($continent);
    }

    public function create(ContinentDTO $data): ContinentResponseDTO
    {
        $continent = Continent::create($data->toArray());
        return new ContinentResponseDTO($continent);
    }

    public function update($id, ContinentDTO $data): ContinentResponseDTO
    {
        $continent = Continent::findOrFail($id);
        $continent->update($data->toArray());
        return new ContinentResponseDTO($continent);
    }

    public function delete($id): bool
    {
        $continent = Continent::findOrFail($id);
        $continent->delete();
        return true;
    }
} 