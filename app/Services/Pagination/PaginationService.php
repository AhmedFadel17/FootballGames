<?php

namespace App\Services\Pagination;

use App\DTOs\Pagination\PaginationResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PaginationService implements IPaginationService
{
    /**
     * Paginate any model query and return a PaginationResponseDTO
     * Supports optional caching
     *
     * @param Builder $query
     * @param PaginationDTO $dto
     * @param string $responseDTOClass
     * @param array $allowedFilters
     * @param array $searchableFields
     * @param int|null $cacheSeconds Optional cache duration in seconds
     * @return PaginationResponseDTO
     */
    public function paginate(
        Builder $query,
        PaginationDTO $dto,
        string $responseDTOClass,
        array $allowedFilters = [],
        array $searchableFields = [],
        ?int $cacheSeconds = null
    ): PaginationResponseDTO {

        // Apply filters
        foreach ($dto->filters as $field => $value) {
            if (!empty($value) && in_array($field, $allowedFilters, true)) {
                $query->where($field, $value);
            }
        }

        // Apply search
        if (!empty($dto->filters['search']) && !empty($searchableFields)) {
            $search = $dto->filters['search'];
            $query->where(function ($q) use ($search, $searchableFields) {
                foreach ($searchableFields as $field) {
                    if (str_contains($field, '.')) {
                        [$relation, $column] = explode('.', $field);
                        $q->orWhereHas($relation, function ($subQuery) use ($column, $search) {
                            $subQuery->where($column, 'ILIKE', "%{$search}%");
                        });
                    } else {
                        $q->orWhere($field, 'ILIKE', "%{$search}%");
                    }
                }
            });
        }

        // Sorting
        if (in_array($dto->sortBy, $allowedFilters, true)) {
            $query->orderBy($dto->sortBy, $dto->sortOrder);
        }

        if ($cacheSeconds !== null && $cacheSeconds > 0) {
            $cacheKey = 'paginate:' . md5(
                $query->toSql() . serialize($query->getBindings()) . serialize($dto)
            );
            $tableName = $query->getModel()->getTable();
            return Cache::tags([$tableName])->remember($cacheKey, $cacheSeconds, function () use ($query, $dto, $responseDTOClass) {
                $paginator = $query->paginate(
                    $dto->perPage,
                    ['*'],
                    'page',
                    $dto->page
                );         
                return new PaginationResponseDTO($paginator, $responseDTOClass);
            });
        }

        $paginator = $query->paginate(
            $dto->perPage,
            ['*'],
            'page',
            $dto->page
        );

        return new PaginationResponseDTO($paginator, $responseDTOClass);
    }
}
