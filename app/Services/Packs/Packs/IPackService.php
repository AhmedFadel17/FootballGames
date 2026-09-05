<?php
namespace App\Services\Packs\Packs;

use App\DTOs\Packs\OpenPackRequestDTO;
use App\DTOs\Packs\PackDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\Pack;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IPackService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;

    public function getOptions(?string $query = null, ?int $limit = 10): Collection;

    public function getById($id): Pack;

    public function create(PackDTO $data): Pack;

    public function update($id, PackDTO $data): Pack;

    public function delete($id): bool;

    public function openPack(OpenPackRequestDTO $dto): array;
}