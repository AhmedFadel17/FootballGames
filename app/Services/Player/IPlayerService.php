<?php

namespace App\Services\Player;

use App\DTOs\Core\Player\PlayerDTO;
use App\DTOs\Core\Player\PlayerResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;

interface IPlayerService
{
    public function getAll(PaginationDTO $dto): PaginationResponseDTO;
    public function getById(int $id) :PlayerResponseDTO;
    public function create(PlayerDTO $data) : PlayerResponseDTO;
    public function update(int $id, PlayerDTO $data) :PlayerResponseDTO;
    public function delete(int $id):bool;
}
