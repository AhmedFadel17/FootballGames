<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use App\Models\Core\Competition;
use App\Models\Core\Team;
use App\Models\Core\Season;
use App\Models\Core\CompetitionParticipant;
use Illuminate\Support\Facades\Storage;

class CompetitionParticipantsSeeder extends Seeder
{
    public function run(): void
    {
        $json = Storage::disk('public')->get('data/epl_participants_by_season.json');
        $data = json_decode($json, true);


        // Get EPL Competition ID
        $competition = Competition::where('name', 'English Premier League')->first();
        if (!$competition) {
            $this->command->error("❌ EPL competition not found.");
            return;
        }

        foreach ($data as $year => $teams) {
            $season = Season::where('start_year', $year)->first();

            if (!$season) {
                $this->command->warn("⚠️ Season not found for year: $year");
                continue;
            }

            foreach ($teams as $teamData) {
                $team = Team::where('api_id', $teamData['id'])
                            ->orWhere('name', $teamData['name'])
                            ->first();

                if (!$team) {
                    $this->command->warn("⚠️ Team not found: ".$teamData['name']);
                    continue;
                }

                CompetitionParticipant::updateOrCreate(
                    [
                        'competition_id' => $competition->id,
                        'season_id' => $season->id,
                        'team_id' => $team->id,
                    ],
                    [
                        'is_winner' => $teamData['is_winner'] ?? false, 
                    ]
                );
            }

            $this->command->info("✅ Inserted participants for season {$year}");
        }

        $this->command->info("🎉 Competition participants seeding completed.");
    }
}
