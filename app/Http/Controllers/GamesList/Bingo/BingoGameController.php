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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\UnauthorizedException;

class BingoGameController extends Controller
{
    private readonly IBingoGameService $_service;

    public function __construct(IBingoGameService $service)
    {
        $this->_service = $service;
    }

    public function skip(int $id): JsonResponse
    {
        $skipped = $this->_service->skip($id);
        return response()->json(true);
    }

    public function check(int $id,int $pos): JsonResponse
    {
        $condition = $this->_service->check($id,$pos);
        return response()->json($condition->toArray());
    }

    public function index(BingoGameFilterRequest $request): JsonResponse
    {
        $dto = $request->validated();
        $bingoGames = $this->_service->getAll($dto);
        return response()->json($bingoGames->toArray());
    }

    public function store(CreateBingoGameRequest $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user) abort(403, 'Unauthorized action.');
        $dto = $request->validated();
        $bingoGame = $this->_service->create($dto["game_id"],$dto["size"],$user);
        return response()->json($bingoGame, 201);
    }

    public function show($id): JsonResponse
    {
        $bingoGame = $this->_service->getById($id);
        return response()->json($bingoGame);
    }



    public function destroy($id): JsonResponse
    {
        $this->_service->delete($id);
        return response()->json(null, 204);
    }
}
