<?php

namespace App\DTOs\Pagination;

class PaginationDTO
{
    public int $page;
    public int $perPage;
    public ?string $search;
    public ?string $sortBy;
    public ?string $sortOrder;
    public array $filters;

    public function __construct(array $data = [])
    {
        $this->page = (int) ($data['page'] ?? 1);
        $this->perPage = (int) ($data['per_page'] ?? 10);
        $this->search = $data['search'] ?? null;
        $this->sortBy = $data['sort_by'] ?? null;
        $this->sortOrder = $data['sort_order'] ?? 'asc';
        $this->filters = $data;
    }

    public static function fromRequest($request): static
    {
        return new static($request->validated());
    }
}
