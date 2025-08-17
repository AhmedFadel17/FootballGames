<?php

namespace App\Services\Player;

use App\DTOs\Core\Player\PlayerDTO;
use App\DTOs\Core\Player\PlayerResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use App\Models\Core\Player;
use App\Models\User;
use App\Repositories\Players\IPlayersRepository;
use App\Services\Pagination\IPaginationService;

class PlayerService implements IPlayerService
{
    public function __construct(private IPaginationService $_paginationService) {}

    public function getAll(PaginationDTO $dto): PaginationResponseDTO
    {
        $allowedFilters = ['position', 'country_id', 'date_of_birth'];
        $searchableFields = ['name', 'fullname'];

        $query = Player::with('country');

        return $this->_paginationService
            ->paginate($query, $dto, PlayerResponseDTO::class, $allowedFilters, $searchableFields);
    }

    public function getById($id): PlayerResponseDTO
    {
        $player = Player::with('country')->findOrFail($id);
        return new PlayerResponseDTO($player);
    }

    public function create(PlayerDTO $data): PlayerResponseDTO
    {
        $player = Player::create($data->toArray());
        $player->load('country');
        return new PlayerResponseDTO($player);
    }

    public function update($id, PlayerDTO $data): PlayerResponseDTO
    {
        $player = Player::findOrFail($id);
        $player->update($data->toArray());
        $player->load('country');
        return new PlayerResponseDTO($player);
    }

    public function delete($id): bool
    {
        $player = Player::findOrFail($id);
        $player->delete();
        return true;
    }
}
