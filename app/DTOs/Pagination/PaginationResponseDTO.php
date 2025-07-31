<?php

namespace App\DTOs\Pagination;

class PaginationResponseDTO
{
    public array $data;
    public array $meta;

    public function __construct($paginator, string $responseDTOClass)
    {
        $this->data = $paginator->getCollection()
            ->map(fn($item) => new $responseDTOClass($item))
            ->toArray();

        $this->meta = [
            'current_page'   => $paginator->currentPage(),
            'total_records'  => $paginator->total(),
            'page_size'      => $paginator->count(),
            'total_pages'    => $paginator->lastPage(),
        ];
    }

    public function toArray(): array
    {
        return [
            'data' => $this->data,
            'meta' => $this->meta,
        ];
    }
}
