<?php

namespace Database\Seeders;

use App\Models\Core\Competition;
use App\Models\Core\CompetitionSeason;
use App\Models\Core\Country;
use App\Models\Core\Season;
use App\Models\Core\Standing;
use App\Models\Core\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class StandingsSeeder extends Seeder
{
    public function run(): void
    {
        Standing::truncate();
        $json = Storage::disk('public')->get('data/standings.json');
        $standings = json_decode($json, true);

        foreach ($standings as $standingData) {
            $competition = Competition::where('slug', $standingData['competition_slug'])
                ->orWhere('api_id', $standingData['competition_id'])
                ->first();
            $season = Season::where([
                'start_year' => $standingData['season'] - 1,
                'end_year' => $standingData['season'],
            ])->first();
            if (!$competition || !$season) {
                continue;
            }

            $teams = $standingData["standings"] ?? [];
            $winnerTeamData = count($teams) > 1 ? $teams[0] : null;
            $winnerTeam = $winnerTeamData ? Team::where('api_id', $winnerTeamData['id'])->orWhere('slug', $winnerTeamData['slug'])->first() : null;

            $competitionSeason = CompetitionSeason::updateOrCreate(
                [
                    'competition_id' => $competition->id,
                    'season_id' => $season->id,
                ],
                [
                    'winner_team_id' => $winnerTeam?->id,
                ]
            );

            foreach ($teams as $teamData) {
                $team = Team::where('api_id', $teamData['id'])->orWhere('slug', $teamData['slug'])->first();
                if (!$team) {
                    $this->command->warn("Team not found for standing data: " . $teamData['name']);
                    continue;
                }

                Standing::updateOrCreate(
                    [
                        'competition_season_id' => $competitionSeason->id,
                        'team_id' => $team->id
                    ],
                    [
                        'position' => $teamData['position'],
                        'points' => $teamData['points'] ?? 0,
                        'played' => $teamData['played'] ?? 0,
                        'won' => $teamData['won'] ?? 0,
                        'drawn' => $teamData['drawn'] ?? 0,
                        'lost' => $teamData['lost'] ?? 0,
                        'goals_for' => $teamData['goals_for'] ?? 0,
                        'goals_against' => $teamData['goals_against'] ?? 0,
                        'goal_difference' => $teamData['goal_difference'] ?? 0,
                    ]
                );
            }

        }
    }



}