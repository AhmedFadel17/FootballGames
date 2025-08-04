<?php

namespace App\Services\GameServices\GameEntry;

use App\DTOs\Game\GameEntry\GameEntryDTO;
use App\DTOs\Game\GameEntry\GameEntryResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface IGameEntryService
{
    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO;
    public function getById(int $id): GameEntryResponseDTO;
    public function create(GameEntryDTO $dto): GameEntryResponseDTO;
    public function update(int $id, GameEntryDTO $dto): GameEntryResponseDTO;
    public function delete(int $id): void;
} 