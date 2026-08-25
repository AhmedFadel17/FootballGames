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
use Illuminate\Support\Facades\DB;

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
        return GameInstance::findOrFail($id);
    }

    public function create(GameInstanceDTO $dto): GameInstance
    {
        return GameInstance::create($dto->toArray());
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
        $this->removeMember($roomId, $user->id);
    }

    public function cancelRoom(int $roomId): void
    {
        $room = GameInstance::findOrFail($roomId);
        if ($room->status !== GameStatus::FINISHED) {
            $room->update([
                'status' => GameStatus::CANCELLED
            ]);
        }
    }

    public function removeMember(int $roomId, int $memberId): void
    {
        DB::transaction(function () use ($roomId, $memberId) {
            $room = GameInstance::findOrFail($roomId);

            // Fetch all current entries in the room
            $entries = GameEntry::where('game_instance_id', $room->id)->get();
            $entryCount = $entries->count();

            $userEntry = $entries->firstWhere('user_id', $memberId);
            if (!$userEntry) {
                return;
            }

            // Scenario 1: Leaving while PENDING
            if ($room->status === GameStatus::PENDING) {
                if ($entryCount <= 1) {
                    // Last player leaving: cancel the room and delete entry
                    $userEntry->delete();
                    $this->cancelRoom($roomId);
                } else {
                    // Reassign creator/admin if the exiting user was the creator
                    if ($memberId === $room->creator_id) {
                        $nextAdminEntry = $entries->firstWhere('user_id', '!=', $memberId);
                        if ($nextAdminEntry) {
                            $room->update([
                                'creator_id' => $nextAdminEntry->user_id
                            ]);
                        }
                    }
                    $userEntry->delete();
                }
            }
            // Scenario 2: Leaving an IN_PROGRESS game
            elseif ($room->status === GameStatus::ACTIVE) {
                // Mark user's entry as left/cancelled
                $userEntry->update([
                    'status' => GameStatus::CANCELLED,
                    'left_at' => now(),
                ]);

                $remainingActiveCount = GameEntry::where('game_instance_id', $room->id)
                    ->where('user_id', '!=', $memberId)
                    ->where('status', '!=', GameStatus::CANCELLED)
                    ->count();

                // If no active players remain, cancel room
                if ($remainingActiveCount === 0) {
                    $this->cancelRoom($roomId);
                }
            }
        });
    }
}