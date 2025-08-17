<?php

namespace App\Services\Country;

use App\DTOs\Core\Country\CountryDTO;
use App\DTOs\Core\Country\CountryResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface ICountryService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getAllOptions(): array;
    public function getById(int $id) :CountryResponseDTO;
    public function create(CountryDTO $data) : CountryResponseDTO;
    public function update(int $id, CountryDTO $data) :CountryResponseDTO;
    public function delete(int $id):bool;
} 