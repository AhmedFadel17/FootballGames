<?php

namespace App\Providers;

use App\Exceptions\Handler;
use App\Services\Core\CompetitionSeasons\CompetitionSeasonService;
use App\Services\Core\CompetitionSeasons\ICompetitionSeasonService;
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
use App\Services\Transfer\ITransferService;
use App\Services\Transfer\TransferService;
use App\Services\CompetitionParticipant\ICompetitionParticipantService;
use App\Services\CompetitionParticipant\CompetitionParticipantService;
use App\Services\PlayerTeamPeriod\IPlayerTeamPeriodService;
use App\Services\PlayerTeamPeriod\PlayerTeamPeriodService;
use App\Services\ManagerTeamPeriod\IManagerTeamPeriodService;
use App\Services\ManagerTeamPeriod\ManagerTeamPeriodService;
use App\Services\CompetitionPlayerFullStat\ICompetitionPlayerFullStatService;
use App\Services\CompetitionPlayerFullStat\CompetitionPlayerFullStatService;
use App\Services\CompetitionTeamFullStat\ICompetitionTeamFullStatService;
use App\Services\CompetitionTeamFullStat\CompetitionTeamFullStatService;

use App\Services\GameServices\GameInstance\IGameInstanceService;
use App\Services\GameServices\GameInstance\GameInstanceService;
use App\Services\GameServices\GameEntry\IGameEntryService;
use App\Services\GameServices\GameEntry\GameEntryService;
use App\Services\GameServices\GameResult\IGameResultService;
use App\Services\GameServices\GameResult\GameResultService;
use App\Services\GameServices\GamePrize\IGamePrizeService;
use App\Services\GameServices\GamePrize\GamePrizeService;

use App\Services\GameServices\Game\GameService;
use App\Services\GameServices\Game\IGameService;
use App\Services\GameServices\GameType\GameTypeService;
use App\Services\GameServices\GameType\IGameTypeService;
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
        $this->app->bind(IPaginationService::class, PaginationService::class);
        $this->app->bind(IPlayerService::class, PlayerService::class);
        $this->app->bind(ITeamService::class, TeamService::class);
        $this->app->bind(ICountryService::class, CountryService::class);
        $this->app->bind(IContinentService::class, ContinentService::class);
        $this->app->bind(ICompetitionService::class, CompetitionService::class);
        $this->app->scoped(ICompetitionSeasonService::class, CompetitionSeasonService::class);

        $this->app->bind(ISeasonService::class, SeasonService::class);
        $this->app->bind(IManagerService::class, ManagerService::class);
        $this->app->bind(ITransferService::class, TransferService::class);
        $this->app->bind(ICompetitionParticipantService::class, CompetitionParticipantService::class);
        $this->app->bind(IPlayerTeamPeriodService::class, PlayerTeamPeriodService::class);
        $this->app->bind(IManagerTeamPeriodService::class, ManagerTeamPeriodService::class);
        $this->app->bind(ICompetitionPlayerFullStatService::class, CompetitionPlayerFullStatService::class);
        $this->app->bind(ICompetitionTeamFullStatService::class, CompetitionTeamFullStatService::class);
        $this->app->bind(IGameService::class, GameService::class);
        $this->app->bind(IGameTypeService::class, GameTypeService::class);
        $this->app->bind(IGameInstanceService::class, GameInstanceService::class);
        $this->app->bind(IGameEntryService::class, GameEntryService::class);
        $this->app->bind(IGameResultService::class, GameResultService::class);
        $this->app->bind(IGamePrizeService::class, GamePrizeService::class);
        $this->app->bind(IBingoGameService::class, BingoGameService::class);
        $this->app->bind(IBingoConditionService::class, BingoConditionService::class);
        $this->app->bind(IBingoMatchService::class, BingoMatchService::class);
        $this->app->bind(ITopListGameService::class, TopListGameService::class);
        $this->app->bind(IGuessThePlayerGameService::class, GuessThePlayerGameService::class);

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
