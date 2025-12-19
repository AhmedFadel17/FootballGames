<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;
use Mockery;
use App\Services\GameServices\GameType\IGameTypeService;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class GameTypeControllerTest extends TestCase
{
    use WithFaker,RefreshDatabase;

    #[Test]
    public function it_loads_game_types_ok()
    {
        $user = User::factory()->create([
            'role' => 'admin',
        ]);

        $data = [
            ['id' => 1, 'name' => $this->faker->word],
            ['id' => 2, 'name' => $this->faker->word],
        ];

        $mock = Mockery::mock(IGameTypeService::class);
        $mock->shouldReceive('getAll')->once()->andReturn($data);

        $this->app->instance(IGameTypeService::class, $mock);

        // Act as the user
        $this->actingAs($user);
        Sanctum::actingAs($user, ['*']); // full scope access

        // Call the endpoint
        $response = $this->getJson('/api/v1/admin/game-types');

        // Assert response
        $response->assertOk()->assertJsonCount(2);
    }


}
