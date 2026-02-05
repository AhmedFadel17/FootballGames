<?php

namespace App\Services\GameServices\GameInstance;

use App\DTOs\Game\GameInstance\GameInstanceDTO;
use App\DTOs\Game\GameInstance\GameInstanceResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Game\GameEntry;
use App\Models\Game\GameInstance;
use App\Models\User;
use App\Services\Pagination\IPaginationService;
use App\Shared\Enums\GameStatus;

class GameInstanceService implements IGameInstanceService
{
    private readonly IPaginationService $_paginationService;

    public function __construct(IPaginationService $paginationService)
    {
        $this->_paginationService = $paginationService;
    }

    public function getAll(PaginationDTO $paginationDTO): PaginationResponseDTO
    {
        $query = GameInstance::query();

        $allowedFilters = ['game_id', 'status'];
        $searchableFields = [];

        return $this->_paginationService->paginate($query, $paginationDTO, GameInstanceResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById(int $id): GameInstanceResponseDTO
    {
        $gameInstance = GameInstance::findOrFail($id);
        return GameInstanceResponseDTO::fromModel($gameInstance);
    }

    public function create(GameInstanceDTO $dto): GameInstanceResponseDTO
    {
        $gameInstance = GameInstance::create($dto->toArray());
        return GameInstanceResponseDTO::fromModel($gameInstance);
    }

    public function update(int $id, GameInstanceDTO $dto): GameInstanceResponseDTO
    {
        $gameInstance = GameInstance::findOrFail($id);
        $gameInstance->update($dto->toArray());
        return GameInstanceResponseDTO::fromModel($gameInstance);
    }

    public function delete(int $id): void
    {
        $gameInstance = GameInstance::findOrFail($id);
        $gameInstance->delete();
    }

    public function leaveRoom(User $user, int $roomId): void
    {
        $userId = $user->id;
        $this->removeMember($roomId, $userId);
    }

    public function cancelRoom(int $roomId): void
    {
        $room = GameInstance::findOrFail($roomId);
        if ($room->status != GameStatus::FINISHED) {
            $room->update([
                'status' => GameStatus::CANCELLED
            ]);
        }
    }
    public function removeMember(int $roomId, int $memberId): void
    {
        $room = GameInstance::findOrFail($roomId);
        $status = $room->status;
        $admin = $room->admin;
        if ($status === GameStatus::PENDING) {
            $entry = GameEntry::where('game_instance_id', $room->id)->where('user_id', $memberId)->firstOr();
            if ($memberId === $admin->id) {
                $newAdminEntry = GameEntry::where('game_instance_id', $room->id)->where('user_id', '!=', $memberId)->first();
                if ($newAdminEntry) {
                    $room->update([
                        'creator_id' => $newAdminEntry->user_id
                    ]);
                } else {
                    $this->cancelRoom($roomId);
                }
            }
            $entry->delete();
        }
    }
}
