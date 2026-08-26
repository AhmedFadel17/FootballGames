<?php

namespace App\Providers;

use App\Exceptions\Handler;
use App\Services\Core\CompetitionSeasons\CompetitionSeasonService;
use App\Services\Core\CompetitionSeasons\ICompetitionSeasonService;
use App\Services\GamesListServices\Career\CareerGameService;
use App\Services\GamesListServices\Career\ICareerGameService;
use App\Services\GamesListServices\Grid\GridAnswer\GridAnswerService;
use App\Services\GamesListServices\Grid\GridAnswer\IGridAnswerService;
use App\Services\GamesListServices\Grid\GridGame\GridGameService;
use App\Services\GamesListServices\Grid\GridGame\IGridGameService;
use App\Services\GamesListServices\Grid\GridValidation\GridValidationService;
use App\Services\GamesListServices\Grid\GridValidation\IGridValidationService;
use App\Services\Pagination\IPaginationService;
use App\Services\Pagination\PaginationService;
use App\Services\Core\Players\IPlayerService;
use App\Services\Core\Players\PlayerService;
use App\Services\Core\Teams\ITeamService;
use App\Services\Core\Teams\TeamService;
use App\Services\Core\Countries\ICountryService;
use App\Services\Core\Countries\CountryService;
use App\Services\Core\Continents\IContinentService;
use App\Services\Core\Continents\ContinentService;
use App\Services\Core\Competitions\ICompetitionService;
use App\Services\Core\Competitions\CompetitionService;
use App\Services\Core\Seasons\ISeasonService;
use App\Services\Core\Seasons\SeasonService;
use App\Services\Core\Managers\IManagerService;
use App\Services\Core\Managers\ManagerService;


use App\Services\GameEngine\GameInstances\IGameInstanceService;
use App\Services\GameEngine\GameInstances\GameInstanceService;
use App\Services\GameEngine\GameEntries\IGameEntryService;
use App\Services\GameEngine\GameEntries\GameEntryService;
use App\Services\GameEngine\GameResults\IGameResultService;
use App\Services\GameEngine\GameResults\GameResultService;
use App\Services\GameEngine\GamePrizes\IGamePrizeService;
use App\Services\GameEngine\GamePrizes\GamePrizeService;
use App\Services\GameEngine\Games\GameService;
use App\Services\GameEngine\Games\IGameService;

use App\Services\GamesListServices\Bingo\BingoCondition\BingoConditionService;
use App\Services\GamesListServices\Bingo\BingoCondition\IBingoConditionService;
use App\Services\GamesListServices\Bingo\BingoGame\BingoGameService;
use App\Services\GamesListServices\Bingo\BingoGame\IBingoGameService;
use App\Services\GamesListServices\Bingo\BingoMatch\BingoMatchService;
use App\Services\GamesListServices\Bingo\BingoMatch\IBingoMatchService;
use App\Services\GamesListServices\GuessThePlayer\GuessThePlayerGameService;
use App\Services\GamesListServices\GuessThePlayer\IGuessThePlayerGameService;
use App\Services\GamesListServices\TopList\ITopListGameService;
use App\Services\GamesListServices\TopList\TopListGameService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use App\Listeners\Reverb\CleanupEmptyRoom;
use App\Listeners\Reverb\ReverbRoomLestiner;
use Illuminate\Support\Facades\Event;
use Laravel\Reverb\Events\ChannelRemoved;
use Laravel\Reverb\Events\MessageReceived;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Pagination Sevices
        $this->app->scoped(IPaginationService::class, PaginationService::class);
        $this->app->scoped(IPlayerService::class, PlayerService::class);

        // Core Services
        $this->app->scoped(ITeamService::class, TeamService::class);
        $this->app->scoped(ICountryService::class, CountryService::class);
        $this->app->scoped(IContinentService::class, ContinentService::class);
        $this->app->scoped(ICompetitionService::class, CompetitionService::class);
        $this->app->scoped(ICompetitionSeasonService::class, CompetitionSeasonService::class);
        $this->app->scoped(ISeasonService::class, SeasonService::class);
        $this->app->scoped(IManagerService::class, ManagerService::class);

        // Game Engine Services
        $this->app->scoped(IGameService::class, GameService::class);
        $this->app->scoped(IGameInstanceService::class, GameInstanceService::class);
        $this->app->scoped(IGameEntryService::class, GameEntryService::class);
        $this->app->scoped(IGameResultService::class, GameResultService::class);
        $this->app->scoped(IGamePrizeService::class, GamePrizeService::class);

        // Games Services
        $this->app->scoped(IBingoGameService::class, BingoGameService::class);
        $this->app->scoped(IBingoConditionService::class, BingoConditionService::class);
        $this->app->scoped(IBingoMatchService::class, BingoMatchService::class);

        $this->app->scoped(IGridGameService::class, GridGameService::class);
        $this->app->scoped(IGridAnswerService::class, GridAnswerService::class);
        $this->app->scoped(IGridValidationService::class, GridValidationService::class);


        $this->app->scoped(ITopListGameService::class, TopListGameService::class);
        $this->app->scoped(IGuessThePlayerGameService::class, GuessThePlayerGameService::class);
        $this->app->scoped(ICareerGameService::class, CareerGameService::class);

        $this->app->singleton(
            ExceptionHandler::class,
            Handler::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Passport::tokensCan([
            'openid' => 'Standard OpenID Connect identification',
            'profile' => 'Access basic user profile',
            'email' => 'Access user email address',
        ]);

        Passport::defaultScopes([
            'openid',
            'profile',
            'email',
        ]);
        // Use custom client model to skip consent prompt for first-party clients
        Passport::useClientModel(\App\Models\PassportClient::class);

        // Register default authorization view required by Passport 13+
        Passport::authorizationView(function ($request, $client, $scopes, $authRequest) {
            return view('passport::authorize', [
                'request' => $request,
                'client' => $client,
                'scopes' => $scopes,
                'authRequest' => $authRequest,
            ]);
        });

        // Passport OAuth 2.0 token lifetimes
        Passport::tokensExpireIn(now()->addHour());
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));

        RateLimiter::for('api', function ($request) {
            return Limit::perMinute(60)->by(
                optional($request->user())->id ?: $request->ip()
            );
        });
        Event::listen(
            ChannelRemoved::class,
            CleanupEmptyRoom::class,
        );

        Event::listen(
            MessageReceived::class,
            ReverbRoomLestiner::class,
        );
    }
}
