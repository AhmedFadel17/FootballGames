<?php

namespace App\Services\GameEngine\GameInstances;

use App\DTOs\GameEngine\GameInstanceDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\GameEngine\GameEntry;
use App\Models\GameEngine\GameInstance;
use App\Models\User;
use App\Services\Pagination\IPaginationService;
use App\Enums\GameEngine\GameStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GameInstanceService implements IGameInstanceService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $paginationDTO): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(GameInstance::query(), $paginationDTO)
            ->allowFilters(['game_id', 'status'])
            ->allowSorts(['id', 'game_id', 'status'])
            ->searchable(['game_id', 'status'])
            ->paginate();
    }

    public function getById(int $id): GameInstance
    {
        $gameInstance = GameInstance::findOrFail($id);
        return $gameInstance;
    }

    public function create(GameInstanceDTO $dto): GameInstance
    {
        $gameInstance = GameInstance::create($dto->toArray());
        return $gameInstance;
    }

    public function update(int $id, GameInstanceDTO $dto): GameInstance
    {
        $gameInstance = GameInstance::findOrFail($id);
        $gameInstance->update($dto->toArray());
        return $gameInstance;
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
