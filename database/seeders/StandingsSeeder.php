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
            $winnerTeam = count($teams) > 1 ? $teams[0] : null;

            $competitionSeason = CompetitionSeason::updateOrCreate(
                [
                    'competition_id' => $competition->id,
                    'season_id' => $season->id,
                ],
                [
                    'winner_team_id' => $winnerTeam['id'] ?? null,
                ]
            );

            foreach ($teams as $teamData) {
                Standing::updateOrCreate(
                    [
                        'competition_season_id' => $competitionSeason->id,
                        'team_id' => $teamData['id'] ?? null
                    ],
                    [
                        'position' => $teamData['position'],
                        'points' => $teamData['points'],
                        'played' => $teamData['played'],
                        'wins' => $teamData['won'],
                        'draws' => $teamData['drawn'],
                        'losses' => $teamData['lost'],
                        'goals_scored' => $teamData['goals_for'],
                        'goals_conceded' => $teamData['goals_against'],
                        'goal_difference' => $teamData['goal_difference'],
                    ]
                );
            }

        }
    }



}