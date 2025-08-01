<?php

namespace App\Services\CompetitionParticipant;

use App\DTOs\Core\CompetitionParticipant\CompetitionParticipantDTO;
use App\DTOs\Core\CompetitionParticipant\CompetitionParticipantResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface ICompetitionParticipantService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :CompetitionParticipantResponseDTO;
    public function create(CompetitionParticipantDTO $data) : CompetitionParticipantResponseDTO;
    public function update(int $id, CompetitionParticipantDTO $data) :CompetitionParticipantResponseDTO;
    public function delete(int $id):bool;
} 