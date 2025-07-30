<?php

namespace Database\Seeders;

use App\Models\Core\Competition;
use App\Models\Core\CompetitionTeamFullStat;
use Illuminate\Database\Seeder;
use App\Models\Core\Team;
use Illuminate\Support\Facades\Storage;

class TeamFullStatsSeeder extends Seeder
{
    public function run(): void
    {
        $json = Storage::disk('public')->get('data/epl_teams_full_stats.json');
        $teams_stats = json_decode($json, true);
        $competition = Competition::where('name', 'English Premier League')->first();
        if (!$competition) {
            $this->command->error("❌ EPL competition not found.");
            return;
        }
        foreach ($teams_stats as $teamData) {
            $team = Team::where('api_id', $teamData['id'])
                ->orWhere('name', $teamData['name'])
                ->first();
            if (!$team) {
                $this->command->warn("⚠️ Team not found: " . $teamData['name']);
                continue;
            }
            $stats=$teamData['stats'];
            CompetitionTeamFullStat::updateOrCreate(
                [
                    'competition_id' => $competition->id,
                    'team_id' => $team->id,
                ],
                [
                    'matches_played'   => (int)($stats['gamesPlayed'] ?? 0),
                    'wins'             => 0, // not provided in JSON
                    'draws'            => 0, // not provided in JSON
                    'losses'           => 0, // not provided in JSON
                    'goals_for'        => (int)($stats['goals'] ?? 0),
                    'goals_against'    => (int)($stats['goalsConceded'] ?? 0),
                    'clean_sheets'     => (int)($stats['cleanSheets'] ?? 0),
                    'yellow_cards'     => (int)($stats['yellowCards'] ?? 0),
                    'red_cards'        => (int)($stats['totalRedCards'] ?? 0),
                    'penalties_scored' => (int)($stats['penaltyGoals'] ?? 0),
                ]
            );
        }
    }
}
