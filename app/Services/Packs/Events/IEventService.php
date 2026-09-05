<?php
namespace App\Services\Packs\Events;

use App\DTOs\Packs\EventDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\Event;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface IEventService
{
    public function getAll(PaginationDTO $dto): LengthAwarePaginator;

    public function getOptions(?string $query = null, ?int $limit = 10): Collection;

    public function getById($id): Event;

    public function create(EventDTO $data): Event;

    public function update($id, EventDTO $data): Event;

    public function delete($id): bool;
}