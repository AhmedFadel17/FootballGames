<?php

namespace App\Http\Controllers\GamesList\Bingo;

use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\Bingo\BingoGame\BingoGameFilterRequest;
use App\Http\Requests\GamesList\Bingo\BingoGame\CreateBingoGameRequest;
use App\Http\Requests\GamesList\Bingo\BingoGame\UpdateBingoGameRequest;
use App\Services\GamesListServices\Bingo\BingoGame\IBingoGameService;
use Illuminate\Http\JsonResponse;

class BingoGameController extends Controller
{
    private readonly IBingoGameService $_service;
    
    public function __construct(IBingoGameService $service)
    {
        $this->_service = $service;
    }

    public function index(BingoGameFilterRequest $request): JsonResponse
    {
        $dto = new PaginationDTO($request->validated());
        $bingoGames = $this->_service->getAll($dto);
        return response()->json($bingoGames->toArray());
    }

    public function store(CreateBingoGameRequest $request): JsonResponse
    {
        $dto = new BingoGameDTO($request->validated());
        $bingoGame = $this->_service->create($dto);
        return response()->json($bingoGame, 201);
    }

    public function show($id): JsonResponse
    {
        $bingoGame = $this->_service->getById($id);
        return response()->json($bingoGame);
    }

    public function update(UpdateBingoGameRequest $request, $id): JsonResponse
    {
        $dto = new BingoGameDTO($request->validated());
        $bingoGame = $this->_service->update($id, $dto);
        return response()->json($bingoGame);
    }

    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
} 