<?php

namespace App\DTOs\Pagination;

class PaginationDTO
{
    public int $perPage;
    public int $page;
    public string $sortBy;
    public string $sortOrder;
    public array $filters;

    public function __construct(array $data = [])
    {
        $this->perPage = isset($data['per_page']) ? (int)$data['per_page'] : 10;
        $this->page = isset($data['page']) ? (int)$data['page'] : 1;
        $this->sortBy = $data['sort_by'] ?? 'id';
        $this->sortOrder = $data['sort_order'] ?? 'asc';

        $this->filters = $this->extractFilters($data);
    }

    private function extractFilters(array $data): array
    {
        unset($data['page'],$data['per_page'], $data['sort_by'], $data['sort_order']);
        return $data;
    }

    public function toArray(): array
    {
        return [
            'per_page' => $this->perPage,
            'page' => $this->page,
            'sort_by' => $this->sortBy,
            'sort_order' => $this->sortOrder,
            'filters' => $this->filters,
        ];
    }
}
