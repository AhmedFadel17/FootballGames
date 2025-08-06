<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [];

    public function boot(): void
    {
        Gate::before(function ($user, $ability) {
        if ($user->role === 'guest') {
            return true; // Allow all actions for guests
        }
        return null;
    });
    }
}
