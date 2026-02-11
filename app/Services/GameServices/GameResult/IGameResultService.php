<?php

namespace App\Services\GameServices\GameResult;

use App\DTOs\Game\GameResult\GameResultDTO;
use App\DTOs\Game\GameResult\GameResultResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\User;
use App\Resources\GameStructure\GameResultResource;

interface IGameResultService
{
    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO;
    public function getById(int $id): GameResultResource;
    public function getByGameInstanceId(User $user,int $gameInstanceId): GameResultResource;
    public function getGameResultsCount(int $gameInstanceId):int;
    public function create(GameResultDTO $dto): GameResultResource;
    public function update(int $id, GameResultDTO $dto): GameResultResource;
    public function delete(int $id): void;
} 