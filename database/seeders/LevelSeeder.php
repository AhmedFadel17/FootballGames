<?php

namespace Database\Seeders;

use App\Models\Infra\Level;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            ['level' => 1, 'required_xp' => 0, 'coin_reward' => 0],
            ['level' => 2, 'required_xp' => 100, 'coin_reward' => 50],
            ['level' => 3, 'required_xp' => 250, 'coin_reward' => 100],
            ['level' => 4, 'required_xp' => 500, 'coin_reward' => 150],
            ['level' => 5, 'required_xp' => 1000, 'coin_reward' => 300],
        ];

        foreach ($levels as $level) {
            Level::updateOrCreate(['level' => $level['level']], $level);
        }
    }
}
