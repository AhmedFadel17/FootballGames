<?php

namespace App\Services\Pagination;

use App\DTOs\Pagination\PaginationDTO;
use App\DTOs\Pagination\PaginationResponseDTO;
use Illuminate\Database\Eloquent\Builder;

interface IPaginationService
{

    public function paginate(
        Builder $query,
        PaginationDTO $dto,
        string $responseDTOClass,
        array $allowedFilters = [],
        array $searchableFields = [],
        ?int $cacheSeconds = null
    ): PaginationResponseDTO;
}
