<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request)
    {
        $dto = $request->validated();

        // normalize
        $email = strtolower(trim($dto['email']));
        $username = strtolower(trim($dto['username']));

        $user = User::create([
            'first_name' => trim($dto['first_name']),
            'last_name'  => trim($dto['last_name']),
            'username'   => $username,
            'email'      => $email,
            'password'   => $dto['password'], // auto-hashed by cast
            'role'       => $request->input('role', 'user'),
        ]);

        return $this->generateTokens($user);
    }

    /**
     * Login user with email & password.
     */
    public function login(LoginRequest $request)
    {
        $dto = $request->validated();

        $user = User::where('email', strtolower(trim($dto['email'])))->first();

        if (!$user || !Hash::check($dto['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return $this->generateTokens($user);
    }

    /**
     * Guest login (no email/password required).
     */
    public function guestLogin()
    {
        $guest = User::create([
            'name' => 'Guest_' . Str::random(5),
            'email' => 'guest_' . Str::random(10) . '@example.com',
            'password' => Hash::make(Str::random(16)),
            'role' => 'guest',
        ]);

        $base = Str::lower(Str::random(6));
        $username ='guest_' . $base;
        $email = $base . '@guest.com';

        $guest = User::create([
            'first_name' => 'Guest',
            'last_name'  => Str::upper(Str::random(4)),
            'username'   => $username,
            'email'      => $email,
            'password'   => Str::random(16), // auto-hashed by cast
            'role'       => 'guest',
        ]);

        return $this->generateTokens($guest);
    }


    /**
     * Refresh access token using a refresh token.
     */
    public function refresh(Request $request)
    {
        $request->validate(['refresh_token' => 'required|string']);

        $hashedToken = hash('sha256', $request->refresh_token);

        $user = User::where('refresh_token', $hashedToken)
            ->where('refresh_token_expires_at', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid or expired refresh token'], 401);
        }

        // Revoke old tokens
        $user->tokens()->delete();

        // Generate new tokens
        return $this->generateTokens($user);
    }

    /**
     * Logout user (revoke all tokens).
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        $request->user()->update([
            'refresh_token' => null,
            'refresh_token_expires_at' => null,
        ]);

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get authenticated user info.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Generate access and refresh tokens for a user.
     */
    private function generateTokens(User $user)
    {
        // Delete old tokens (optional for single-session)
        $user->tokens()->delete();

        // Create access token with role as ability
        $accessToken = $user->createToken('auth_token')->plainTextToken;

        // Create refresh token
        $refreshToken = Str::random(64);

        $user->update([
            'refresh_token' => hash('sha256', $refreshToken),
            'refresh_token_expires_at' => now()->addDays(30),
        ]);

        return response()->json([
            'user' => $user,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => 3600, // 1 hour
        ]);
    }
}
