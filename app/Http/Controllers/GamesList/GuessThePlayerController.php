<?php

namespace App\Http\Controllers\GamesList;

use App\DTOs\GamesList\Bingo\BingoGame\BingoGameDTO;
use App\DTOs\GamesList\GuessThePlayer\CreateGuessThePlayerGameDto;
use App\DTOs\GamesList\GuessThePlayer\JoinGuessThePlayerGameDto;
use App\DTOs\Pagination\PaginationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\GamesList\Bingo\BingoGame\BingoGameFilterRequest;
use App\Http\Requests\GamesList\Bingo\BingoGame\CreateBingoGameRequest;
use App\Http\Requests\GamesList\Bingo\BingoGame\UpdateBingoGameRequest;
use App\Http\Requests\GamesList\GuessThePlayer\CreateGuessThePlayerGameRequest;
use App\Http\Requests\GamesList\GuessThePlayer\JoinGuessThePlayerGameRequest;
use App\Services\GamesListServices\Bingo\BingoGame\IBingoGameService;
use App\Services\GamesListServices\GuessThePlayer\IGuessThePlayerGameService;
use App\Shared\Enums\GameDifficulty;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\UnauthorizedException;
use Illuminate\Http\Request;

class GuessThePlayerController extends Controller
{
    private readonly IGuessThePlayerGameService $_service;

    public function __construct(IGuessThePlayerGameService $service)
    {
        $this->_service = $service;
    }

    public function getById(Request $request,$id): JsonResponse
    {
        $user = $request->user();
        $game = $this->_service->getById($user,$id);
        return response()->json($game, 201);
    }

    public function getByInstanceId(Request $request,$instanceId): JsonResponse
    {
        $user = $request->user();
        $game = $this->_service->getByInstanceId($user,$instanceId);
        return response()->json($game, 201);
    }
    public function start($instanceId): JsonResponse
    {
        $game = $this->_service->start($instanceId);
        return response()->json($game, 201);
    }
    public function create(CreateGuessThePlayerGameRequest $request): JsonResponse
    {
        $user = $request->user();
        $dto = CreateGuessThePlayerGameDto::fromRequest($request);
        $bingoGame = $this->_service->create($user, $dto);
        return response()->json($bingoGame, 201);
    }
    public function join(Request $request): JsonResponse
    {
        $user = $request->user();
        $bingoGame = $this->_service->join($user);
        return response()->json($bingoGame, 201);
    }

    public function joinWithCode(JoinGuessThePlayerGameRequest $request): JsonResponse
    {
        $user = $request->user();
        $dto = JoinGuessThePlayerGameDto::fromRequest($request);
        $bingoGame = $this->_service->joinWithCode($user, $dto);
        return response()->json($bingoGame, 201);
    }

    public function submitAnswer(Request $request,$assignmentId): JsonResponse
    {
        $user = $request->user();
        $answer = $this->_service->submitAnswer($user,$assignmentId,(int)$request->answer_id);
        return response()->json($answer, 201);
    }
}
