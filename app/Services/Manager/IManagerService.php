<?php

namespace App\Services\Manager;

use App\DTOs\Core\Manager\ManagerDTO;
use App\DTOs\Core\Manager\ManagerResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface IManagerService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :ManagerResponseDTO;
    public function create(ManagerDTO $data) : ManagerResponseDTO;
    public function update(int $id, ManagerDTO $data) :ManagerResponseDTO;
    public function delete(int $id):bool;
} 