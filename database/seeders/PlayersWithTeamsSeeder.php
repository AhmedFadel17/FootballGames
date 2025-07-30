<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Core\Player;
use App\Models\Core\Team;
use App\Models\Core\PlayerTeamPeriod;
use App\Models\Core\Country;
use Illuminate\Support\Facades\Storage;

class PlayersWithTeamsSeeder extends Seeder
{
    public function run(): void
    {
        $json = Storage::disk('public')->get('data/epl_players.json');
        $data = json_decode($json, true);


        foreach ($data as $playerData) {
            // Find country (optional)
            $country = Country::where('code', $playerData['country'])->first();

            // Map position to your ENUM values (GK, DEF, MID, FWD)
            $positionMap = [
                'Goalkeeper' => 'GK',
                'Defender' => 'DEF',
                'Midfielder' => 'MID',
                'Forward' => 'FWD',
            ];
            $position = $positionMap[$playerData['position']] ?? 'MID';

            // Insert player
            $player = Player::updateOrCreate(
                ['api_id' => $playerData['id']],
                [
                    'name'          => $playerData['name'],
                    'fullname'      => $playerData['fullname'] ?? $playerData['name'],
                    'position'      => $position,
                    'date_of_birth' => (!empty($playerData['date_of_birth']) && strtolower($playerData['date_of_birth']) !== 'unknown')
                        ? $playerData['date_of_birth']
                        : null,
                    'country_id'    => $country->id ?? null
                ]
            );


            // Insert team periods
            if (!empty($playerData['teams'])) {
                foreach ($playerData['teams'] as $teamData) {
                    $team = Team::where('api_id', $teamData['id'])
                        ->orWhere('name', $teamData['name'])
                        ->first();

                    if (!$team) {
                        $this->command->warn("⚠️ Skipped team '{$teamData['name']}' for player {$player->name} (team not found)");
                        continue;
                    }

                    PlayerTeamPeriod::updateOrCreate(
                        [
                            'player_id' => $player->id,
                            'start_date' => $teamData['start']
                        ],
                        [
                            'team_id'   => $team->id,
                            'end_date'   => $teamData['end'] ?? null
                        ]
                    );
                }
            }

            $this->command->info("✅ Inserted player: " . $player->name);
        }

        $this->command->info("🎉 Players and team periods seeding completed.");
    }
}
