<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ContinentSeeder::class,
            CountriesTableSeeder::class,
            CompetitionsSeeder::class,
            SeasonSeeder::class,
            TeamSeeder::class,
            TeamFullStatsSeeder::class,
            CompetitionParticipantsSeeder::class,
            PlayersWithTeamsSeeder::class,
            CompetitionPlayerFullStatsSeeder::class,
            GameTypesTableSeeder::class,
            GamesTableSeeder::class,
            AdminSeeder::class
        ]);
    }
}
