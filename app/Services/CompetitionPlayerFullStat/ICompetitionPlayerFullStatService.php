<?php

namespace App\Services\CompetitionPlayerFullStat;

use App\DTOs\Core\CompetitionPlayerFullStat\CompetitionPlayerFullStatDTO;
use App\DTOs\Core\CompetitionPlayerFullStat\CompetitionPlayerFullStatResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface ICompetitionPlayerFullStatService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :CompetitionPlayerFullStatResponseDTO;
    public function create(CompetitionPlayerFullStatDTO $data) : CompetitionPlayerFullStatResponseDTO;
    public function update(int $id, CompetitionPlayerFullStatDTO $data) :CompetitionPlayerFullStatResponseDTO;
    public function delete(int $id):bool;
} 