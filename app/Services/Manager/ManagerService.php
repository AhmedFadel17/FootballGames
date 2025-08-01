<?php

namespace App\Services\Manager;

use App\DTOs\Core\Manager\ManagerDTO;
use App\DTOs\Core\Manager\ManagerResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Manager;
use App\Services\Pagination\IPaginationService;

class ManagerService implements IManagerService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['nationality'];
        $searchableFields = ['name'];

        return $this->_paginationService
            ->paginate(Manager::query(), $dto, ManagerResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): ManagerResponseDTO
    {
        $manager = Manager::findOrFail($id);
        return new ManagerResponseDTO($manager);
    }

    public function create(ManagerDTO $data): ManagerResponseDTO
    {
        $manager = Manager::create($data->toArray());
        return new ManagerResponseDTO($manager);
    }

    public function update($id, ManagerDTO $data): ManagerResponseDTO
    {
        $manager = Manager::findOrFail($id);
        $manager->update($data->toArray());
        return new ManagerResponseDTO($manager);
    }

    public function delete($id): bool
    {
        $manager = Manager::findOrFail($id);
        $manager->delete();
        return true;
    }
} 