<?php

namespace App\Services\Pagination;

use App\DTOs\Pagination\PaginationDTO;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

interface IPaginationService
{
    /**
     * Initialize the pagination instance with a target query and DTO.
     */
    public function for(Builder $query, PaginationDTO $dto): static;

    /**
     * Specify allowed exact-match filter columns.
     */
    public function allowFilters(array $filters): static;

    /**
     * Specify allowed sortable columns.
     */
    public function allowSorts(array $sorts): static;

    /**
     * Specify searchable columns (supports relation fields like 'user.name').
     */
    public function searchable(array $fields): static;

    /**
     * Apply all conditions and execute the pagination query.
     */
    public function paginate(): LengthAwarePaginator;
}