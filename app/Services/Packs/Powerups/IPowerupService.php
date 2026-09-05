<?php
namespace App\Services\Packs\Powerups;

use App\DTOs\Packs\PowerupDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\Powerup;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IPowerupService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;

    public function getOptions(?string $query = null, ?int $limit = 10): Collection;

    public function getById($id): Powerup;

    public function create(PowerupDTO $data): Powerup;

    public function update($id, PowerupDTO $data): Powerup;

    public function delete($id): bool;
}