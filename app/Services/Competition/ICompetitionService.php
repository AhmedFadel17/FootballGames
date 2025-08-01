<?php

namespace App\Services\Competition;

use App\DTOs\Core\Competition\CompetitionDTO;
use App\DTOs\Core\Competition\CompetitionResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface ICompetitionService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :CompetitionResponseDTO;
    public function create(CompetitionDTO $data) : CompetitionResponseDTO;
    public function update(int $id, CompetitionDTO $data) :CompetitionResponseDTO;
    public function delete(int $id):bool;
} 