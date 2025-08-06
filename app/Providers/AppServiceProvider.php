<?php

namespace App\Providers;

use App\Exceptions\Handler;
use App\Services\Pagination\IPaginationService;
use App\Services\Pagination\PaginationService;
use App\Services\Player\IPlayerService;
use App\Services\Player\PlayerService;
use App\Services\Team\ITeamService;
use App\Services\Team\TeamService;
use App\Services\Country\ICountryService;
use App\Services\Country\CountryService;
use App\Services\Continent\IContinentService;
use App\Services\Continent\ContinentService;
use App\Services\Competition\ICompetitionService;
use App\Services\Competition\CompetitionService;
use App\Services\Season\ISeasonService;
use App\Services\Season\SeasonService;
use App\Services\Manager\IManagerService;
use App\Services\Manager\ManagerService;
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
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Gate;

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
        RateLimiter::for('api', function ($request) {
            return Limit::perMinute(60)->by(
                optional($request->user())->id ?: $request->ip()
            );
        });
    }
}
