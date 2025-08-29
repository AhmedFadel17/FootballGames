<?php

namespace App\Http\Controllers\GamesList\TopList;

use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\GamesList\TopList\TopListGameDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\Bingo\BingoGame\BingoGameFilterRequest;
use App\Http\Requests\GamesList\Bingo\BingoGame\CreateBingoGameRequest;
use App\Http\Requests\GamesList\Bingo\BingoGame\UpdateBingoGameRequest;
use App\Http\Requests\GamesList\TopList\CreateTopListGameRequest;
use App\Services\GamesListServices\Bingo\BingoGame\IBingoGameService;
use App\Services\GamesListServices\TopList\ITopListGameService;
use App\Shared\Enums\GameDifficulty;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\UnauthorizedException;
use Illuminate\Http\Request;

class TopListGameController extends Controller
{
    private readonly ITopListGameService $_service;

    public function __construct(ITopListGameService $service)
    {
        $this->_service = $service;
    }

    public function index(): JsonResponse
    {
        $games = $this->_service->getAll();
        return response()->json($games);
    }

    public function startGame(Request $request,$id): JsonResponse
    {
        $user = $request->user();
        $match = $this->_service->startGame($user, $id);
        return response()->json($match->toArray());
    }


    public function check(Request $request, int $id, int $objectId): JsonResponse
    {
        $user = $request->user();
        $item = $this->_service->check($user, $id, $objectId);
        return response()->json($item->toArray());
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

    public function store(CreateTopListGameRequest $request): JsonResponse
    {
        $rq = $request->validated();
        $dto = TopListGameDTO::fromRequest($rq);
        $bingoGame = $this->_service->create($dto);
        return response()->json($bingoGame, 201);
    }
}
