<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Authenticate user session for Passport OIDC flow.
     */
    public function login(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Authenticated successfully. Redirecting...',
            'user' => $request->user(),
        ]);
    }

    /**
     * Register a new user account.
     *
     * This does NOT return tokens — after registration the user is
     * redirected to /login where they authenticate via Passport OIDC.
     */
    public function register(RegisterRequest $request)
    {
        $dto = $request->validated();

        $user = User::create([
            'first_name' => trim($dto['first_name']),
            'last_name' => trim($dto['last_name']),
            'username' => strtolower(trim($dto['username'])),
            'email' => strtolower(trim($dto['email'])),
            'password' => $dto['password'], // auto-hashed by cast
            'role' => 'user',
        ]);

        return response()->json([
            'message' => 'Account created successfully. Please sign in.',
            'user' => ['id' => $user->id, 'email' => $user->email],
        ], 201);
    }

    /**
     * Guest login — creates a temporary user and issues a Passport
     * personal access token directly (non-OIDC path).
     *
     * The token is short-lived and stored in the browser's localStorage
     * by the frontend (key: guest_access_token).
     */
    public function guestLogin()
    {
        $base = Str::lower(Str::random(6));
        $username = 'guest_' . $base;
        $email = $base . '@guest.local';

        $guest = User::create([
            'first_name' => 'Guest',
            'last_name' => Str::upper(Str::random(4)),
            'username' => $username,
            'email' => $email,
            'password' => Str::random(16), // auto-hashed by cast
            'role' => 'guest',
        ]);

        // Issue a personal access token via Passport
        $token = $guest->createToken('guest_token')->accessToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => 3600,
            'user' => [
                'id' => $guest->id,
                'username' => $guest->username,
                'role' => $guest->role,
            ],
        ]);
    }

    /**
     * Logout – revoke all Passport tokens for the authenticated user.
     */
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        if ($request->hasSession()) {
            auth('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        $redirectUri = $request->query('post_logout_redirect_uri');

        if ($redirectUri) {
            return redirect()->away($redirectUri);
        }

        return response()->json(['message' => 'Logged out successfully']);
    }
    /**
     * Return the currently authenticated user's profile.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * OIDC-compatible UserInfo endpoint.
     *
     * Returns standard OIDC claims so that react-oidc-context / oidc-client-ts
     * can populate auth.user.profile automatically when loadUserInfo is true.
     *
     * Passport 13 exposes this automatically at /oauth/userinfo, but we keep a
     * custom endpoint so we can include app-specific claims (role, username, etc.)
     */
    public function userinfo(Request $request)
    {
        $user = $request->user();

        return response()->json([
            // Standard OIDC claims
            'sub' => (string) $user->id,
            'name' => trim("{$user->first_name} {$user->last_name}"),
            'given_name' => $user->first_name,
            'family_name' => $user->last_name,
            'email' => $user->email,
            'email_verified' => !is_null($user->email_verified_at),

            // Custom claims — role, username, avatar
            'role' => $user->role,
            'username' => $user->username,
            'picture' => $user->avatar,
            'coins' => $user->coins,
            'games_played' => $user->games_played,
            'games_won' => $user->games_won,
            'games_lost' => $user->games_lost,
            'favorite_team' => $user->favorite_team,
        ]);
    }
}
