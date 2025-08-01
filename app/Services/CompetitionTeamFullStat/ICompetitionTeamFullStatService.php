<?php

namespace App\Services\CompetitionTeamFullStat;

use App\DTOs\Core\CompetitionTeamFullStat\CompetitionTeamFullStatDTO;
use App\DTOs\Core\CompetitionTeamFullStat\CompetitionTeamFullStatResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface ICompetitionTeamFullStatService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :CompetitionTeamFullStatResponseDTO;
    public function create(CompetitionTeamFullStatDTO $data) : CompetitionTeamFullStatResponseDTO;
    public function update(int $id, CompetitionTeamFullStatDTO $data) :CompetitionTeamFullStatResponseDTO;
    public function delete(int $id):bool;
} 