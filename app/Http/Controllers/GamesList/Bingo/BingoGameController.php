<?php

namespace App\Http\Controllers\GamesList\Bingo;

use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\Bingo\BingoGame\BingoGameFilterRequest;
use App\Http\Requests\GamesList\Bingo\BingoGame\CreateBingoGameRequest;
use App\Http\Requests\GamesList\Bingo\BingoGame\UpdateBingoGameRequest;
use App\Services\GamesListServices\Bingo\BingoGame\IBingoGameService;
use App\Shared\Enums\GameDifficulty;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\UnauthorizedException;
use Illuminate\Http\Request;

class BingoGameController extends Controller
{
    private readonly IBingoGameService $_service;

    public function __construct(IBingoGameService $service)
    {
        $this->_service = $service;
    }

    public function nextMatch(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $match = $this->_service->nextMatch($user, $id);
        return response()->json($match->toArray());
    }
    public function check(Request $request, int $id, int $pos): JsonResponse
    {
        $user = $request->user();
        $condition = $this->_service->check($user, $id, $pos);
        return response()->json($condition->toArray());
    }


    public function cancelGame(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $this->_service->cancelGame($user, $id);
        return response()->json(true);
    }

    public function gameResults(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $res = $this->_service->results($user, $id);
        return response()->json($res->toArray());
    }

    public function store(CreateBingoGameRequest $request): JsonResponse
    {
        $user = $request->user();
        $dto = $request->validated();
        $bingoGame = $this->_service->create($user, $dto["size"], $dto["difficulty"]);
        return response()->json($bingoGame, 201);
    }
}
