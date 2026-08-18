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

// Override Passport token endpoint to return custom OIDC id_token
Route::post('/oauth/token', [OAuthTokenController::class, 'issueToken']);

// OIDC JWKS endpoint for signature verification
Route::get('/oauth/jwks', function () {
    $publicKeyStr = file_get_contents(storage_path('oauth-public.key'));
    $publicKey = openssl_pkey_get_public($publicKeyStr);
    $keyDetails = openssl_pkey_get_details($publicKey);

    $n = $keyDetails['rsa']['n'];
    $e = $keyDetails['rsa']['e'];

    $jwk = [
        'kty' => 'RSA',
        'n'   => rtrim(strtr(base64_encode($n), '+/', '-_'), '='),
        'e'   => rtrim(strtr(base64_encode($e), '+/', '-_'), '='),
        'alg' => 'RS256',
        'use' => 'sig',
        'kid' => 'passport-key',
    ];

    return response()->json([
        'keys' => [$jwk]
    ]);
});

Route::get('/.well-known/openid-configuration', function () {
    $url = config('app.url');

    return response()->json([
        'issuer' => $url,
        'authorization_endpoint' => $url . '/oauth/authorize',
        'token_endpoint' => $url . '/oauth/token',
        'userinfo_endpoint' => $url . '/api/auth/userinfo',
        'end_session_endpoint' => $url . '/oauth/logout',
        'revocation_endpoint' => $url . '/oauth/tokens/revoke',
        'jwks_uri' => $url . '/oauth/jwks',
        'response_types_supported' => ['code'],
        'subject_types_supported' => ['public'],
        'id_token_signing_alg_values_supported' => ['RS256'],
        'scopes_supported' => ['openid', 'profile', 'email'],
    ]);
});
// ✅ React App entry point
Route::view('/{any}', 'app')
    ->where('any', '.*')
    ->name('react-app');
// Route::get('/', function () {
//     return Inertia::render('index', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__ . '/auth.php';
