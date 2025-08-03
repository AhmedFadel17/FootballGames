<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GameTypesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gameTypes = [
            [
                'name' => 'Bingo',
                'slug' => 'bingo',
                'description' => 'Classic football bingo game where you match players with conditions.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Top 10',
                'slug' => 'top-10',
                'description' => 'Guess the top 10 players or teams based on stats or achievements.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Guess the Player',
                'slug' => 'guess-player',
                'description' => 'Try to guess the player based on hints or stats provided.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fantasy Draft',
                'slug' => 'fantasy-draft',
                'description' => 'Draft your fantasy team and compete with others in real-time.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Quick Quiz',
                'slug' => 'quick-quiz',
                'description' => 'Fast-paced football quiz with multiple choice questions.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('game_types')->insertOrIgnore($gameTypes);
    }
}
