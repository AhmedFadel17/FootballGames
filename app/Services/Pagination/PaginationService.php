<?php

namespace App\Services\Pagination;

use App\DTOs\Pagination\PaginationResponseDTO;
use App\DTOs\Pagination\PaginationDTO;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

class PaginationService implements IPaginationService
{
    /**
     * Paginate any model query and return a PaginationResponseDTO
     *
     * @param Builder $query
     * @param PaginationDTO $dto
     * @param string $responseDTOClass
     * @return PaginationResponseDTO
     */
    public function paginate(
        Builder $query,
        PaginationDTO $dto,
        string $responseDTOClass,
        array $allowedFilters = [],
        array $searchableFields = []
    ): PaginationResponseDTO {
        foreach ($dto->filters as $field => $value) {
            if (!empty($value) && in_array($field, $allowedFilters, true)) {
                $query->where($field, $value);
            }
        }

        if (!empty($dto->filters['search']) && !empty($searchableFields)) {
            $search = $dto->filters['search'];
            $query->where(function ($q) use ($search, $searchableFields) {
                foreach ($searchableFields as $field) {
                    // handle nested relations like players.name
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


        if (in_array($dto->sortBy, $allowedFilters, true)) {
            $query->orderBy($dto->sortBy, $dto->sortOrder);
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
