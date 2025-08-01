<?php

namespace App\Services\Season;

use App\DTOs\Core\Season\SeasonDTO;
use App\DTOs\Core\Season\SeasonResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface ISeasonService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :SeasonResponseDTO;
    public function create(SeasonDTO $data) : SeasonResponseDTO;
    public function update(int $id, SeasonDTO $data) :SeasonResponseDTO;
    public function delete(int $id):bool;
} 