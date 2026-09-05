<?php
namespace App\Services\Packs\Cosmetics;

use App\DTOs\Packs\CosmeticDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\Cosmetic;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ICosmeticService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;

    public function getOptions(?string $query = null, ?int $limit = 10): Collection;

    public function getById($id): Cosmetic;

    public function create(CosmeticDTO $data): Cosmetic;

    public function update($id, CosmeticDTO $data): Cosmetic;

    public function delete($id): bool;
}