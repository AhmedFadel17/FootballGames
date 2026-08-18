<?php

namespace App\Services\Core\Managers;

use App\DTOs\Core\ManagerDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Core\Manager;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface IManagerService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;
    public function getById(int $id): Manager;
    public function create(ManagerDTO $data): Manager;
    public function update(int $id, ManagerDTO $data): Manager;
    public function delete(int $id): bool;
}