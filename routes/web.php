<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OAuthTokenController;
use Inertia\Inertia;

// ✅ Session Login endpoint for SPA (OIDC authorization PKCE helper)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/oauth/logout', [AuthController::class, 'logout']);

// Override Passport token endpoint to return custom OIDC id_token
Route::post('/oauth/token', [OAuthTokenController::class, 'issueToken']);

Route::get('/.well-known/openid-configuration', [OAuthTokenController::class, 'discovery']);
Route::get('/oauth/jwks', [OAuthTokenController::class, 'jwks']);
// ✅ React App entry point
Route::view('/{any}', 'app')
    ->where('any', '.*')
    ->name('react-app');


require __DIR__ . '/auth.php';
