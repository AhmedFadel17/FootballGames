<?php
namespace App\Http\Controllers\Packs;

use App\DTOs\Packs\EventDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Packs\Event\EventFilterRequest;
use App\Http\Requests\Packs\Event\StoreEventRequest;
use App\Http\Requests\Packs\Event\UpdateEventRequest;
use App\Resources\Packs\EventResource;
use App\Resources\Shared\LookupResource;
use App\Services\Packs\Events\IEventService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    use ApiResponses;

    private readonly IEventService $_service;

    public function __construct(IEventService $service)
    {
        $this->_service = $service;
    }

    public function index(EventFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $events = $this->_service->getAll($dto);
        return $this->paginatedResponse($events, EventResource::class, 'Events retrieved successfully');
    }

    public function getOptions(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 10);
        $events = $this->_service->getOptions($query, $limit);
        return $this->successResponse(
            data: LookupResource::collectionWith(
                resource: $events,
                valueKey: 'id',
                labelKey: 'name',
                extraFields: ['slug', 'img_src']
            ),
            message: 'Events options retrieved successfully'
        );
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $dto = EventDTO::fromRequest($request);
        $event = $this->_service->create($dto);
        return $this->successResponse(new EventResource($event), 'Event created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $event = $this->_service->getById($id);
        return $this->successResponse(new EventResource($event), 'Event retrieved successfully');
    }

    public function update(UpdateEventRequest $request, $id): JsonResponse
    {
        $dto = EventDTO::fromRequest($request);
        $event = $this->_service->update($id, $dto);
        return $this->successResponse(new EventResource($event), 'Event updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Event deleted successfully');
    }
}