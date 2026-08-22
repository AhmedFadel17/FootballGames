<?php

namespace App\Services\Core\Managers;

use App\DTOs\Core\ManagerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Manager;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ManagerService implements IManagerService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Manager::query()->with('country'), $dto)
            ->allowFilters(['country_id', 'popularity'])
            ->allowSorts(['id', 'name', 'country_id', 'popularity'])
            ->searchable(['name'])
            ->paginate();
    }

    public function getById($id): Manager
    {
        $manager = Manager::with(['country', 'teamPeriods.team'])->findOrFail($id);
        return $manager;
    }

    public function create(ManagerDTO $data): Manager
    {
        $manager = Manager::create($data->toArray());
        return $manager;
    }

    public function update($id, ManagerDTO $data): Manager
    {
        $manager = Manager::findOrFail($id);
        $manager->update($data->toUpdateArray());
        return $manager;
    }

    public function delete($id): bool
    {
        $manager = Manager::findOrFail($id);
        $manager->delete();
        return true;
    }
}