<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|in:user,admin,guest'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role ?? 'user',
        ]);

        return $this->generateTokens($user);
    }

    /**
     * Login user with email & password.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
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
