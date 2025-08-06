<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Core\CompetitionController;
use App\Http\Controllers\Core\CompetitionParticipantController;
use App\Http\Controllers\Core\CompetitionPlayerFullStatController;
use App\Http\Controllers\Core\CompetitionTeamFullStatController;
use App\Http\Controllers\Core\ContinentController;
use App\Http\Controllers\Core\CountryController;
use App\Http\Controllers\Core\ManagerController;
use App\Http\Controllers\Core\ManagerTeamPeriodController;
use App\Http\Controllers\Core\PlayerController;
use App\Http\Controllers\Core\PlayerTeamPeriodController;
use App\Http\Controllers\Core\SeasonController;
use App\Http\Controllers\Core\TeamController;
use App\Http\Controllers\Core\TransferController;
use App\Http\Controllers\Game\GameController;
use App\Http\Controllers\Game\GameTypeController;
use App\Http\Controllers\GamesList\Bingo\BingoConditionController;
use App\Http\Controllers\GamesList\Bingo\BingoGameController;
use App\Http\Controllers\GamesList\Bingo\BingoMatchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/guest-login', [AuthController::class, 'guestLogin']);
});


Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});


Route::middleware('auth:sanctum')->prefix('v1')->group(function () {

    Route::prefix('u')->group(function () {
        Route::prefix('games-list')->group(function () {
            Route::apiResource('bingo', BingoGameController::class);
            Route::get('bingo/{id}/conditions', [BingoConditionController::class, 'getByGameId']);
            Route::get('bingo/{id}/next-match', [BingoMatchController::class, 'getByGameId']);
            Route::post('bingo/{id}/skip', [BingoGameController::class, 'skip']);
            Route::post('bingo/{id}/check/{pos}',  [BingoGameController::class, 'check']);
        });
        Route::apiResource('games', GameController::class);
        Route::apiResource('game-types', GameTypeController::class);
    });


    Route::prefix('admin')->group(function () {
        Route::apiResource('competitions', CompetitionController::class);
        Route::apiResource('competition-participants', CompetitionParticipantController::class);
        Route::apiResource('competition-player-stats', CompetitionPlayerFullStatController::class);
        Route::apiResource('competition-team-stats', CompetitionTeamFullStatController::class);
        Route::apiResource('continents', ContinentController::class);
        Route::apiResource('countries', CountryController::class);
        Route::apiResource('managers', ManagerController::class);
        Route::apiResource('manager-team-periods', ManagerTeamPeriodController::class);
        Route::apiResource('players', PlayerController::class);
        Route::apiResource('player-team-periods', PlayerTeamPeriodController::class);
        Route::apiResource('seasons', SeasonController::class);
        Route::apiResource('teams', TeamController::class);
        Route::apiResource('transfers', TransferController::class);
    });
});
