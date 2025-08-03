<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GamesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get IDs for game types
        $bingoId = DB::table('game_types')->where('slug', 'bingo')->value('id');
        $top10Id = DB::table('game_types')->where('slug', 'top-10')->value('id');
        $guessPlayerId = DB::table('game_types')->where('slug', 'guess-player')->value('id');
        $fantasyDraftId = DB::table('game_types')->where('slug', 'fantasy-draft')->value('id');
        $quizId = DB::table('game_types')->where('slug', 'quick-quiz')->value('id');

        $games = [
            [
                'title' => 'Premier League Bingo 2025',
                'game_type_id' => $bingoId,
                'description' => 'Match players with clubs, managers and stats in EPL Bingo 2025.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Top 10 EPL Scorers 2025',
                'game_type_id' => $top10Id,
                'description' => 'Guess the top 10 goal scorers in the English Premier League 2025 season.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Guess the EPL Player 2025',
                'game_type_id' => $guessPlayerId,
                'description' => 'Try to guess the Premier League player based on hints.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Premier League Fantasy Draft 2025',
                'game_type_id' => $fantasyDraftId,
                'description' => 'Draft your dream EPL team and compete in a fantasy draft challenge.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Quick EPL Trivia Quiz 2025',
                'game_type_id' => $quizId,
                'description' => 'Fast-paced quiz about English Premier League players and clubs.',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('games')->insertOrIgnore($games);
    }
}
