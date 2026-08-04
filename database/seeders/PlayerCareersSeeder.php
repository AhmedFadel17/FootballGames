<?php

namespace Database\Seeders;

use App\Models\Core\Competition;
use App\Models\Core\Player;
use App\Models\Core\PlayerCareerSummary;
use App\Models\Core\PlayerSeasonStat;
use App\Models\Core\Season;
use App\Models\Core\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use JsonMachine\Items;
use JsonMachine\JsonDecoder\ExtJsonDecoder;
class PlayerCareersSeeder extends Seeder
{
    public function run(): void
    {
        DB::disableQueryLog();

        PlayerSeasonStat::truncate();
        PlayerCareerSummary::truncate();

        $filePath = Storage::disk('public')->path('data/all_careers.json');
        $playersData = Items::fromFile($filePath, [
            'decoder' => new ExtJsonDecoder(true)
        ]);


        foreach ($playersData as $playerData) {
            $player = Player::where('slug', $playerData['player_slug'])->first();
            if (!$player) {
                continue;
            }

            // 1. Process Career Season Stats
            $careerEntries = $playerData['career'] ?? [];
            foreach ($careerEntries as $entry) {
                $team = !empty($entry['club_slug'])
                    ? Team::where('slug', $entry['club_slug'])->first()
                    : null;

                $competition = !empty($entry['competition_slug'])
                    ? Competition::where('slug', $entry['competition_slug'])->first()
                    : null;
                $season = Season::where('name', $entry['season'])->first();

                PlayerSeasonStat::create([
                    'player_id' => $player->id,
                    'team_id' => $team?->id,
                    'competition_id' => $competition?->id,
                    'season_id' => $season?->id,
                    'is_detail' => (bool) ($entry['is_detail'] ?? true),
                    'appearances' => $entry['appearances'] ?? 0,
                    'goals' => $entry['goals'] ?? 0,
                    'assists' => $entry['assists'] ?? 0,
                    'yellow_cards' => $entry['yellow_cards'] ?? 0,
                    'red_cards' => $entry['red_cards'] ?? 0,
                    'matches_started' => $entry['matches_started'] ?? 0,
                    'matches_from_bench' => $entry['matches_from_bench'] ?? 0,
                    'minutes' => $entry['minutes'] ?? 0,
                    'age' => $entry['age'] ?? null,
                    'points' => $entry['points'] ?? null,
                    'elo' => $entry['elo'] ?? null,
                ]);
            }

            // 2. Process Career Summary Stats
            $summaryEntries = $playerData['career_summary'] ?? [];
            foreach ($summaryEntries as $summary) {
                $team = !empty($summary['team_slug'])
                    ? Team::where('slug', $summary['team_slug'])->first()
                    : null;

                PlayerCareerSummary::create([
                    'player_id' => $player->id,
                    'team_id' => $team?->id,
                    'appearances' => $summary['appearances'] ?? 0,
                    'goals' => $summary['goals'] ?? 0,
                    'assists' => $summary['assists'] ?? 0,
                    'yellow_cards' => $summary['yellow_cards'] ?? 0,
                    'red_cards' => $summary['red_cards'] ?? 0,
                    'matches_started' => $summary['matches_started'] ?? 0,
                    'matches_from_bench' => $summary['matches_from_bench'] ?? 0,
                    'minutes' => $summary['minutes'] ?? 0,
                    'points' => $summary['points'] ?? null,
                    'elo' => $summary['elo'] ?? null,
                ]);
            }
        }
    }
}