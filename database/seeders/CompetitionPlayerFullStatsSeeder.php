<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Core\Competition;
use App\Models\Core\Player;
use App\Models\Core\CompetitionPlayerFullStat;
use Illuminate\Support\Facades\Storage;

class CompetitionPlayerFullStatsSeeder extends Seeder
{
    public function run(): void
    {
        $json = Storage::disk('public')->get('data/epl_players_full_stats.json');
        $data = json_decode($json, true);

        // Assuming EPL competition already exists
        $competition = Competition::where('name', 'English Premier League')->first();

        if (!$competition) {
            $this->command->error("❌ Competition 'English Premier League' not found.");
            return;
        }

        foreach ($data as $playerData) {
            $player = Player::where('api_id', $playerData['id'])
                            ->orWhere('name', $playerData['name'])
                            ->first();

            if (!$player) {
                $this->command->warn("⚠️ Player not found: " . $playerData['name']);
                continue;
            }

            $stats = $playerData['stats'] ?? [];

            CompetitionPlayerFullStat::updateOrCreate(
                [
                    'competition_id' => $competition->id,
                    'player_id'      => $player->id,
                ],
                [
                    'appearances'       => (int)($stats['appearances'] ?? 0),
                    'minutes_played'    => (int)($stats['timePlayed'] ?? 0),
                    'goals'             => (int)($stats['goals'] ?? 0),
                    'assists'           => (int)($stats['goalAssists'] ?? 0),
                    'yellow_cards'      => (int)($stats['yellowCards'] ?? 0),
                    'red_cards'         => (int)($stats['totalRedCards'] ?? 0),
                    'clean_sheets'      => (int)($stats['cleanSheets'] ?? 0),
                    'saves'             => (int)($stats['savesMade'] ?? 0),
                    'penalties_saved'   => (int)($stats['penaltiesSaved'] ?? 0),
                    'own_goals'         => (int)($stats['ownGoalScored'] ?? 0),
                    'goals_conceded'    => (int)($stats['goalsConceded'] ?? 0),
                ]
            );

            $this->command->info("✅ Inserted stats for player: " . $playerData['name']);
        }

        $this->command->info("🎉 Competition player full stats seeding completed.");
    }
}
