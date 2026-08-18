<?php

namespace App\Traits;

use App\Resources\Shared\PaginationResource;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

trait ApiResponses
{
    /**
     * Standard Success Response
     */
    public function successResponse(mixed $data, string $message = 'Success', int $status = 200): JsonResponse
    {
        return response()->json([
            'data' => $data,
            'message' => $message,
            'status' => $status,
        ], $status);
    }

    /**
     * Standard Error Response
     */
    public function errorResponse(string $message = 'Error occurred', int $status = 400, mixed $errors = null): JsonResponse
    {
        $payload = [
            'data' => $errors,
            'message' => $message,
            'status' => $status,
        ];

        return response()->json($payload, $status);
    }

    /**
     * Standard Paginated Response matching PaginationResponse<T>
     */
    public function paginatedResponse(
        LengthAwarePaginator $paginator,
        string $itemResourceClass,
        string $message = 'Data retrieved successfully',
        int $status = 200
    ): JsonResponse {
        $paginatedData = new PaginationResource($paginator, $itemResourceClass);

        return $this->successResponse($paginatedData, $message, $status);
    }
}