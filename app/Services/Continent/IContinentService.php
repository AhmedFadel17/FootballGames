<?php

namespace App\Services\Continent;

use App\DTOs\Core\Continent\ContinentDTO;
use App\DTOs\Core\Continent\ContinentResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface IContinentService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :ContinentResponseDTO;
    public function create(ContinentDTO $data) : ContinentResponseDTO;
    public function update(int $id, ContinentDTO $data) :ContinentResponseDTO;
    public function delete(int $id):bool;
} 