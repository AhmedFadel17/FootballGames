<?php
namespace App\Resources\Shared;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\AbstractPaginator;

class PaginationResource extends JsonResource
{
    protected string $itemResourceClass;

    /**
     * @param AbstractPaginator $resource
     * @param string|null $itemResourceClass
     */
    public function __construct($resource, ?string $itemResourceClass = null)
    {
        parent::__construct($resource);
        $this->itemResourceClass = $itemResourceClass ?? JsonResource::class;
    }

    public static function collectionWith($resource, string $itemResourceClass): static
    {
        return new static($resource, $itemResourceClass);
    }

    public function toArray(Request $request): array
    {
        /** @var \Illuminate\Pagination\LengthAwarePaginator $paginator */
        $paginator = $this->resource;

        $items = $this->itemResourceClass === JsonResource::class
            ? $paginator->items()
            : $this->itemResourceClass::collection($paginator->items());

        return [
            'items' => $items,
            'pageNumber' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
            'totalPages' => $paginator->lastPage(),
            'totalCount' => $paginator->total(),
            'itemsCount' => $paginator->count(),
            'hasPreviousPage' => $paginator->currentPage() > 1,
            'hasNextPage' => $paginator->hasMorePages(),
        ];
    }
}