<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Core\CompetitionController;
use App\Http\Controllers\Core\CompetitionSeasonController;
use App\Http\Controllers\Core\ContinentController;
use App\Http\Controllers\Core\CountryController;
use App\Http\Controllers\Core\ManagerController;
use App\Http\Controllers\Core\PlayerController;
use App\Http\Controllers\Core\SeasonController;
use App\Http\Controllers\Core\TeamController;
use App\Http\Controllers\GameEngine\GameController;
use App\Http\Controllers\GameEngine\GameInstanceController;
use App\Http\Controllers\GameEngine\GameResultController;
use App\Http\Controllers\GamesList\BingoGameController;
use App\Http\Controllers\GamesList\CareerGameController;
use App\Http\Controllers\GamesList\GridGameController;
use App\Http\Controllers\GamesList\GuessThePlayerController;
use App\Http\Controllers\GamesList\TopListGameController;
use App\Http\Controllers\Packs\CosmeticController;
use App\Http\Controllers\Packs\EventController;
use App\Http\Controllers\Packs\PackController;
use App\Http\Controllers\Packs\PackDropRuleController;
use App\Http\Controllers\Packs\PlayerCardController;
use App\Http\Controllers\Packs\PowerupController;
use App\Http\Controllers\Packs\UserStoreController;
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
    Route::post('/login', [AuthController::class, 'login']);
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
    Route::get('/my-progress', [AuthController::class, 'myProgress']);

    // OIDC-compatible UserInfo endpoint — used by react-oidc-context (loadUserInfo: true)
    // Returns standard OIDC claims + app-specific claims (role, username, etc.)
    Route::get('/userinfo', [AuthController::class, 'userinfo']);
});


// ─── Authenticated API routes ─────────────────────────────────────────────────
Route::middleware('auth:api')->prefix('v1')->group(function () {

    //-----------------------------All Authenticated User-----------------------------
    Route::middleware(['role:user,guest,admin'])->group(function () {
        Route::get('games', [GameController::class, 'index']);
        Route::get('lookups/countries', [CountryController::class, 'getOptions']);
        Route::get('lookups/competitions', [CompetitionController::class, 'getOptions']);
        Route::get('lookups/teams', [TeamController::class, 'getOptions']);
        Route::get('lookups/players', [PlayerController::class, 'getOptions']);
        Route::get('lookups/managers', [ManagerController::class, 'getOptions']);
        Route::get('lookups/packs', [PackController::class, 'getOptions']);
        Route::get('lookups/events', [EventController::class, 'getOptions']);
        Route::get('lookups/player-cards', [PlayerCardController::class, 'getOptions']);
    });

    //-----------------------------User-----------------------------
    //--------------------------------------------------------------
    Route::middleware(['role:user,guest'])->group(function () {

        Route::prefix('rooms')->group(function () {
            Route::post('{id}/leave', [GameInstanceController::class, 'leaveRoom']);
            Route::get('{id}/results', [GameResultController::class, 'getByGameInstanceId']);
        });

        Route::prefix('games-list')->group(function () {
            Route::prefix('bingo')->group(function () {
                Route::get('{id}', [BingoGameController::class, 'getGameInstance']);
                Route::get('{id}/conditions', [BingoGameController::class, 'getConditions']);
                Route::post('', [BingoGameController::class, 'startGame']);
                Route::post('{id}/skip', [BingoGameController::class, 'skip']);
                Route::post('{id}/check/{pos}', [BingoGameController::class, 'check']);
                Route::get('{id}/next-match', [BingoGameController::class, 'nextMatch']);
            });

            Route::prefix('career')->group(function () {
                Route::get('{id}', [CareerGameController::class, 'getGameInstance']);
                Route::post('{id}/reveal', [CareerGameController::class, 'reveal']);
                Route::post('{id}/guess', [CareerGameController::class, 'guess']);
                Route::post('', [CareerGameController::class, 'startGame']);
            });

            Route::prefix('football-grid')->group(function () {
                Route::get('/{id}', [GridGameController::class, 'getGameInstanceDetails']);
                Route::post('', [GridGameController::class, 'startGame']);
                Route::post('/{id}/submit', [GridGameController::class, 'submitAnswer']);
            });

            Route::prefix('top-list')->group(function () {
                Route::get('/{id}', [TopListGameController::class, 'getGameInstanceDetails']);
                Route::post('/start', [TopListGameController::class, 'startGame']);
                Route::post('/{id}/check/{objectId}', [TopListGameController::class, 'check']);
            });


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

        // ─── User Store & Pack Opening ─────────────────────────────────
        Route::prefix('store')->group(function () {
            Route::get('packs', [UserStoreController::class, 'packs']);
            Route::get('powerups', [UserStoreController::class, 'powerups']);
            Route::get('cosmetics', [UserStoreController::class, 'cosmetics']);
            Route::post('open-pack', [UserStoreController::class, 'openPack']);
        });

        // ─── User Team & Inventory ─────────────────────────────────────
        Route::prefix('my-team')->group(function () {
            Route::get('cards', [UserStoreController::class, 'myCards']);
            Route::get('powerups', [UserStoreController::class, 'myPowerups']);
            Route::get('cosmetics', [UserStoreController::class, 'myCosmetics']);
            Route::get('lineup', [UserStoreController::class, 'getLineup']);
            Route::post('lineup', [UserStoreController::class, 'saveLineup']);
        });
    });


    //-----------------------------Admin-----------------------------
    //--------------------------------------------------------------
    Route::middleware(['role:admin'])->group(function () {
        Route::apiResource('games', GameController::class)->except('index');
        Route::prefix('admin/games-list')->group(function () {
            Route::apiResource('bingo', BingoGameController::class);
            Route::apiResource('top-list', TopListGameController::class);
            Route::apiResource('football-grid', GridGameController::class);
            Route::apiResource('player-career', CareerGameController::class);
        });
        Route::get('competitions/{id}/teams', [CompetitionController::class, 'getTeams']);
        Route::apiResource('competitions', CompetitionController::class);
        Route::get('competition-seasons/{id}/standings', [CompetitionSeasonController::class, 'getStandings']);
        Route::apiResource('competition-seasons', CompetitionSeasonController::class);
        Route::apiResource('continents', ContinentController::class);
        Route::apiResource('countries', CountryController::class);
        Route::apiResource('managers', ManagerController::class);
        Route::apiResource('players', PlayerController::class);
        Route::apiResource('seasons', SeasonController::class);
        Route::apiResource('teams', TeamController::class);

        Route::apiResource('powerups', PowerupController::class);
        Route::apiResource('cosmetics', CosmeticController::class);
        Route::post('packs/open', [PackController::class, 'open']);
        Route::apiResource('packs', PackController::class);
        Route::apiResource('events', EventController::class);
        Route::apiResource('player-cards', PlayerCardController::class);
        Route::apiResource('pack-drop-rules', PackDropRuleController::class);



    });
});
