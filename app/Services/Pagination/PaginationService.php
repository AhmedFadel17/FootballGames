<?php

namespace App\Services\Pagination;

use App\DTOs\Pagination\PaginationDTO;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class PaginationService implements IPaginationService
{
    protected Builder $query;
    protected PaginationDTO $dto;
    protected array $allowedFilters = [];
    protected array $allowedSorts = [];
    protected array $searchableFields = [];

    /**
     * Initialize a new pagination instance for a given Eloquent query and DTO.
     */
    public function for(Builder $query, PaginationDTO $dto): static
    {
        $instance = new static();
        $instance->query = clone $query;
        $instance->dto = $dto;

        return $instance;
    }

    /**
     * Specify allowed exact-match filter columns.
     */
    public function allowFilters(array $filters): static
    {
        $this->allowedFilters = $filters;
        return $this;
    }

    /**
     * Specify allowed sortable columns.
     */
    public function allowSorts(array $sorts): static
    {
        $this->allowedSorts = $sorts;
        return $this;
    }

    /**
     * Specify searchable columns (supports relation fields like 'user.name').
     */
    public function searchable(array $fields): static
    {
        $this->searchableFields = $fields;
        return $this;
    }

    /**
     * Apply all query conditions and return the LengthAwarePaginator instance.
     */
    public function paginate(): LengthAwarePaginator
    {
        $this->applyFilters();
        $this->applySearch();
        $this->applySorting();

        return $this->query->paginate(
            perPage: $this->dto->perPage ?? 10,
            columns: ['*'],
            pageName: 'page',
            page: $this->dto->page ?? 1
        );
    }

    /**
     * Apply exact-match filters from DTO against allowed whitelist.
     */
    protected function applyFilters(): void
    {
        if (empty($this->dto->filters)) {
            return;
        }

        foreach ($this->dto->filters as $field => $value) {
            // Ignore search, page, per_page, sort params if present in filters array
            if (in_array($field, ['search', 'page', 'per_page', 'sort_by', 'sort_order'], true)) {
                continue;
            }

            // Strict check so false or 0 are not filtered out by empty()
            if ($value !== null && $value !== '' && in_array($field, $this->allowedFilters, true)) {
                $this->query->where($field, $value);
            }
        }
    }

    /**
     * Apply multi-column search across direct and relationship fields.
     */
    protected function applySearch(): void
    {
        $search = $this->dto->search ?? ($this->dto->filters['search'] ?? null);

        if (empty($search) || empty($this->searchableFields)) {
            return;
        }

        // Database-agnostic case-insensitive search
        $likeOperator = DB::getDriverName() === 'pgsql' ? 'ILIKE' : 'LIKE';

        $this->query->where(function (Builder $q) use ($search, $likeOperator) {
            foreach ($this->searchableFields as $field) {
                // Support nested relationship searches e.g. "user.email"
                if (str_contains($field, '.')) {
                    [$relation, $column] = explode('.', $field);
                    $q->orWhereHas($relation, function (Builder $subQuery) use ($column, $search, $likeOperator) {
                        $subQuery->where($column, $likeOperator, "%{$search}%");
                    });
                } else {
                    $q->orWhere($field, $likeOperator, "%{$search}%");
                }
            }
        });
    }

    /**
     * Apply sorting if field is in the allowed whitelist.
     */
    protected function applySorting(): void
    {
        $sortBy = $this->dto->sortBy ?? ($this->dto->filters['sort_by'] ?? null);
        $sortOrder = strtolower($this->dto->sortOrder ?? ($this->dto->filters['sort_order'] ?? 'asc'));

        if (!empty($sortBy) && in_array($sortBy, $this->allowedSorts, true)) {
            $order = in_array($sortOrder, ['asc', 'desc'], true) ? $sortOrder : 'asc';
            $this->query->orderBy($sortBy, $order);
        }
    }
}