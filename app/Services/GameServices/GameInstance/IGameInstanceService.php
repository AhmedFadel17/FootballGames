<?php

namespace App\Services\GameServices\GameInstance;

use App\DTOs\Game\GameInstance\GameInstanceDTO;
use App\DTOs\Game\GameInstance\GameInstanceResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\User;

interface IGameInstanceService
{
    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO;
    public function getById(int $id): GameInstanceResponseDTO;
    public function create(GameInstanceDTO $dto): GameInstanceResponseDTO;
    public function update(int $id, GameInstanceDTO $dto): GameInstanceResponseDTO;
    public function delete(int $id): void;
    public function leaveRoom(User $user, int $roomId): void;
    public function cancelRoom(int $roomId): void;
    public function removeMember(int $roomId, int $memberId): void;
}
