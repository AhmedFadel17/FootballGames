<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Game\Game;

class GameTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_returns_a_list_of_games()
    {
        // Arrange
        Game::factory()->count(3)->create();

        // Act
        $response = $this->getJson('/api/v1/u/games');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }
}
