<?php

namespace App\Providers;

use App\Exceptions\Handler;
use App\Services\Pagination\IPaginationService;
use App\Services\Pagination\PaginationService;
use App\Services\Player\IPlayerService;
use App\Services\Player\PlayerService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Debug\ExceptionHandler;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(IPaginationService::class, PaginationService::class);
        $this->app->bind(IPlayerService::class, PlayerService::class);
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
    }
}
