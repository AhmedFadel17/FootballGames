<?php

use App\Models\PassportClient;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    PassportClient::create([
        'name' => 'Personal Access Client',
        'secret' => Str::random(40),
        'provider' => 'users',
        'redirect_uris' => ['http://localhost'],
        'grant_types' => ['personal_access'],
        'revoked' => false,
    ]);
});

test('user can register via api endpoint', function () {
    $response = $this->postJson('/api/auth/register', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'username' => 'johndoe',
        'email' => 'johndoe@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'access_token',
            'token_type',
            'expires_in',
            'user' => [
                'id',
                'username',
                'email',
            ],
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'johndoe@example.com',
        'username' => 'johndoe',
    ]);
});

test('user can login via api using email', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
        'username' => 'unique_user',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'user@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'message',
            'access_token',
            'token_type',
            'expires_in',
            'user' => [
                'id',
                'email',
            ],
        ]);
});

test('user can login via api using username', function () {
    $user = User::factory()->create([
        'email' => 'user2@example.com',
        'username' => 'testusername',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/auth/login', [
        'username' => 'testusername',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'message',
            'access_token',
            'token_type',
            'expires_in',
            'user',
        ]);
});

test('guest user can login via api', function () {
    $response = $this->postJson('/api/auth/guest');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'message',
            'access_token',
            'token_type',
            'expires_in',
            'user' => [
                'id',
                'username',
                'role',
            ],
        ]);
});

test('oauth password grant flow works with client credentials and username or email', function () {
    $client = PassportClient::create([
        'name' => 'Password Grant Client',
        'secret' => 'test-secret',
        'provider' => 'users',
        'redirect_uris' => ['http://localhost'],
        'grant_types' => ['password'],
        'revoked' => false,
    ]);

    $user = User::factory()->create([
        'email' => 'oauthuser@example.com',
        'username' => 'oauthuser',
        'password' => bcrypt('password123'),
    ]);

    // Test with email
    $responseEmail = $this->postJson('/oauth/token', [
        'grant_type' => 'password',
        'client_id' => $client->id,
        'client_secret' => 'test-secret',
        'username' => 'oauthuser@example.com',
        'password' => 'password123',
    ]);

    $responseEmail->assertStatus(200)
        ->assertJsonStructure([
            'token_type',
            'expires_in',
            'access_token',
        ]);

    // Test with username
    $responseUsername = $this->postJson('/oauth/token', [
        'grant_type' => 'password',
        'client_id' => $client->id,
        'client_secret' => 'test-secret',
        'username' => 'oauthuser',
        'password' => 'password123',
    ]);

    $responseUsername->assertStatus(200)
        ->assertJsonStructure([
            'token_type',
            'expires_in',
            'access_token',
        ]);
});
