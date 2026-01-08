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
use App\Http\Controllers\GamesList\TopList\TopListGameController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/guest', [AuthController::class, 'guestLogin']);
});


Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});


Route::middleware('auth:sanctum')->prefix('v1')->group(function () {

    //----------------------------Shared----------------------------
    //--------------------------------------------------------------

    //-----------------------------User-----------------------------
    //--------------------------------------------------------------
    Route::prefix('u')->middleware(['role:user,guest'])->group(function () {
        Route::get('game-types', [GameTypeController::class, 'getAllWithGamesList']);
        Route::get('games', [GameController::class,'index']);
        Route::get('players', [PlayerController::class, 'index']);
        Route::get('countries', [CountryController::class, 'index']);
        Route::get('teams', [TeamController::class, 'index']);

        Route::prefix('games-list')->group(function () {
            Route::get('bingo/{id}/conditions', [BingoConditionController::class, 'getByGameId']);
            Route::post('bingo', [BingoGameController::class, 'store']);
            Route::get('bingo/{id}/next-match', [BingoGameController::class, 'nextMatch']);
            Route::post('bingo/{id}/skip', [BingoGameController::class, 'skip']);
            Route::post('bingo/{id}/check/{pos}',  [BingoGameController::class, 'check']);
            Route::get('bingo/{id}/results',  [BingoGameController::class, 'gameResults']);
            Route::post('bingo/{id}/cancel',  [BingoGameController::class, 'cancelGame']);

            Route::apiResource('top-list', TopListGameController::class)->only(['index', 'show']);
            Route::post('top-list/{id}/start', [TopListGameController::class, 'startGame']);
            Route::post('top-list/{id}/cancel', [TopListGameController::class, 'cancelGame']);
            Route::get('top-list/{id}/results', [TopListGameController::class, 'gameResults']);
            Route::post('top-list/{id}/check/{objectId}',  [TopListGameController::class, 'check']);

            
        });
    });


    //-----------------------------Admin-----------------------------
    //--------------------------------------------------------------
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {
        Route::apiResource('game-types', GameTypeController::class);
        Route::apiResource('games', GameController::class);
        Route::prefix('games-list')->group(function () {
            Route::apiResource('top-list', TopListGameController::class);
        });
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

        Route::get('options/countries', [CountryController::class, 'getAllOptions']);
        Route::get('options/players', [CountryController::class, 'getAllOptions']);
        Route::get('options/teams', [CountryController::class, 'getAllOptions']);
        Route::get('options/competitions', [CountryController::class, 'getAllOptions']);
    });
});
