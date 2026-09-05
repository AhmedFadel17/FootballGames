<?php

namespace App\Http\Controllers\Packs;

use App\DTOs\Packs\PlayerCardDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Packs\PlayerCard\PlayerCardFilterRequest;
use App\Http\Requests\Packs\PlayerCard\StorePlayerCardRequest;
use App\Http\Requests\Packs\PlayerCard\UpdatePlayerCardRequest;
use App\Resources\Packs\PlayerCardResource;
use App\Resources\Shared\LookupResource;
use App\Services\Packs\PlayerCards\IPlayerCardService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlayerCardController extends Controller
{
    use ApiResponses;

    private readonly IPlayerCardService $_service;

    public function __construct(IPlayerCardService $service)
    {
        $this->_service = $service;
    }

    public function index(PlayerCardFilterRequest $request): JsonResponse
    {
        $dto = PaginationDTO::fromRequest($request);
        $cards = $this->_service->getAll($dto);
        return $this->paginatedResponse($cards, PlayerCardResource::class, 'Player cards retrieved successfully');
    }

    public function getOptions(Request $request): JsonResponse
    {
        $query = $request->input('query');
        $limit = $request->input('limit', 10);
        $cards = $this->_service->getOptions($query, $limit);
        return $this->successResponse(
            data: LookupResource::collectionWith(
                resource: $cards,
                valueKey: 'id',
                labelKey: 'id',
                extraFields: ['rating', 'rarity', 'img_src']
            ),
            message: 'Player cards options retrieved successfully'
        );
    }

    public function store(StorePlayerCardRequest $request): JsonResponse
    {
        $dto = PlayerCardDTO::fromRequest($request);
        $card = $this->_service->create($dto);
        return $this->successResponse(new PlayerCardResource($card), 'Player card created successfully', 201);
    }

    public function show($id): JsonResponse
    {
        $card = $this->_service->getById($id);
        return $this->successResponse(new PlayerCardResource($card), 'Player card retrieved successfully');
    }

    public function update(UpdatePlayerCardRequest $request, $id): JsonResponse
    {
        $dto = PlayerCardDTO::fromRequest($request);
        $card = $this->_service->update($id, $dto);
        return $this->successResponse(new PlayerCardResource($card), 'Player card updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return $this->successResponse(null, 'Player card deleted successfully');
    }
}