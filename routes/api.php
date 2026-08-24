<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Core\CompetitionController;
use App\Http\Controllers\Core\CompetitionParticipantController;
use App\Http\Controllers\Core\CompetitionPlayerFullStatController;
use App\Http\Controllers\Core\CompetitionSeasonController;
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
use App\Http\Controllers\GameEngine\GameController;
use App\Http\Controllers\GameEngine\GameInstanceController;
use App\Http\Controllers\GameEngine\GameResultController;
use App\Http\Controllers\GamesList\BingoGameController;
use App\Http\Controllers\GamesList\GuessThePlayerController;
use App\Http\Controllers\GamesList\TopList\TopListGameController;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;


// ─── WebSocket Broadcast Auth ─────────────────────────────────────────────────
Route::get('/user', fn(\Illuminate\Http\Request $r) => $r->user())->middleware('auth:api');
Broadcast::routes(['middleware' => ['auth:api']]);


// ─── Public auth helpers (no token required) ─────────────────────────────────
// Registration and guest login sit outside the OIDC flow:
//   - Register creates the account; user then signs in via /oauth/authorize
//   - Guest creates a temp user and returns a short-lived Passport token directly
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/guest', [AuthController::class, 'guestLogin']);
});


// ─── Authenticated-only auth helpers ─────────────────────────────────────────
// Login/register/token-refresh are handled by Passport's own OAuth endpoints:
//   POST /oauth/token          — exchange code+verifier for access+refresh tokens
//   GET  /oauth/authorize      — PKCE authorization endpoint
//   POST /oauth/token/refresh  — refresh access token (done by oidc-client-ts automatically)
//
// We expose only session management + profile endpoints here.
Route::middleware('auth:api')->prefix('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // OIDC-compatible UserInfo endpoint — used by react-oidc-context (loadUserInfo: true)
    // Returns standard OIDC claims + app-specific claims (role, username, etc.)
    Route::get('/userinfo', [AuthController::class, 'userinfo']);
});


// ─── Authenticated API routes ─────────────────────────────────────────────────
Route::middleware('auth:api')->prefix('v1')->group(function () {

    //-----------------------------All Authenticated User-----------------------------
    Route::middleware(['role:user,guest,admin'])->group(function () {
        Route::get('games', [GameController::class, 'index']);

    });

    //-----------------------------User-----------------------------
    //--------------------------------------------------------------
    Route::middleware(['role:user,guest'])->group(function () {
        Route::get('players', [PlayerController::class, 'index']);
        Route::get('countries', [CountryController::class, 'index']);
        Route::get('teams', [TeamController::class, 'index']);

        Route::prefix('rooms')->group(function () {
            Route::get('{id}/leave', [GameInstanceController::class, 'leaveRoom']);
            Route::get('{id}/result', [GameResultController::class, 'getByGameInstanceId']);
        });

        Route::prefix('games-list')->group(function () {
            Route::get('bingo/{id}/conditions', [BingoGameController::class, 'getConditions']);
            Route::post('bingo', [BingoGameController::class, 'store']);
            Route::post('bingo/{id}/skip', [BingoGameController::class, 'skip']);
            Route::post('bingo/{id}/check/{pos}', [BingoGameController::class, 'check']);
            Route::get('bingo/{id}/results', [BingoGameController::class, 'gameResults']);
            Route::post('bingo/{id}/cancel', [BingoGameController::class, 'cancelGame']);
            Route::get('bingo/{id}/next-match', [BingoGameController::class, 'nextMatch']);

            Route::apiResource('top-list', TopListGameController::class)->only(['index', 'show']);
            Route::post('top-list/{id}/start', [TopListGameController::class, 'startGame']);
            Route::post('top-list/{id}/cancel', [TopListGameController::class, 'cancelGame']);
            Route::get('top-list/{id}/results', [TopListGameController::class, 'gameResults']);
            Route::post('top-list/{id}/check/{objectId}', [TopListGameController::class, 'check']);

            Route::prefix('guess-the-player')->group(function () {
                Route::get('instance/{room_id}', [GuessThePlayerController::class, 'getByInstanceId']);
                Route::get('game/{id}', [GuessThePlayerController::class, 'getById']);
                Route::post('create', [GuessThePlayerController::class, 'create']);
                Route::post('join', [GuessThePlayerController::class, 'join']);
                Route::post('join-with-code', [GuessThePlayerController::class, 'joinWithCode']);
                Route::post('assignments/{assignment_id}/submit', [GuessThePlayerController::class, 'submitAnswer']);
                Route::post('assignments/{assignment_id}/ask', [GuessThePlayerController::class, 'askPlayer']);
            });
        });
    });


    //-----------------------------Admin-----------------------------
    //--------------------------------------------------------------
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('games', GameController::class)->except('index');
        Route::prefix('games-list')->group(function () {
            Route::apiResource('top-list', TopListGameController::class);
        });
        Route::get('competitions/{id}/teams', [CompetitionController::class, 'getTeams']);
        Route::apiResource('competitions', CompetitionController::class);
        Route::get('competition-seasons/{id}/standings', [CompetitionSeasonController::class, 'getStandings']);
        Route::apiResource('competition-seasons', CompetitionSeasonController::class);
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

        Route::get('lookups/countries', [CountryController::class, 'getAllOptions']);
        Route::get('lookups/players', [PlayerController::class, 'getAllOptions']);
        Route::get('lookups/teams', [TeamController::class, 'getAllOptions']);
        Route::get('lookups/competitions', [CompetitionController::class, 'getAllOptions']);
    });
});
