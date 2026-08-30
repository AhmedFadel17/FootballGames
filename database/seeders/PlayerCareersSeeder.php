<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use JsonMachine\Items;
use JsonMachine\JsonDecoder\ExtJsonDecoder;

class PlayerCareersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @param bool $onlySummaries Flag to seed ONLY career summaries (skip season stats)
     */
    public function run(bool $onlySummaries = false): void
    {
        ini_set('memory_limit', '1024M');
        DB::disableQueryLog();
        // 1. Conditional Table Truncation
        if ($onlySummaries) {
            DB::statement('TRUNCATE TABLE player_career_summaries RESTART IDENTITY;');
        } else {
            DB::statement('TRUNCATE TABLE player_season_stats, player_career_summaries RESTART IDENTITY;');
        }

        // 2. Pre-load all lookup maps into lightweight arrays (Massive performance boost)
        $playersMap = DB::table('players')->pluck('id', 'slug')->all();
        $teamsMap = DB::table('teams')->pluck('id', 'slug')->all();
        $competitionsMap = DB::table('competitions')->pluck('id', 'slug')->all();
        $seasonsMap = DB::table('seasons')->pluck('id', 'name')->all();

        $filePath = Storage::disk('public')->path('data/all_careers.json');
        $playersData = Items::fromFile($filePath, [
            'decoder' => new ExtJsonDecoder(true)
        ]);

        $seasonStatsBuffer = [];
        $summariesBuffer = [];
        $now = now()->toDateTimeString();

        foreach ($playersData as $playerData) {
            $playerId = $playersMap[$playerData['player_slug'] ?? ''] ?? null;
            if (!$playerId) {
                continue;
            }

            // 3. Process Season Stats (Skipped if $onlySummaries is true)
            if (!$onlySummaries) {
                $careerEntries = $playerData['career'] ?? [];
                foreach ($careerEntries as $entry) {
                    $teamId = !empty($entry['club_slug']) ? ($teamsMap[$entry['club_slug']] ?? null) : null;
                    $competitionId = !empty($entry['competition_slug']) ? ($competitionsMap[$entry['competition_slug']] ?? null) : null;
                    $seasonId = !empty($entry['season']) ? ($seasonsMap[$entry['season']] ?? null) : null;

                    $seasonStatsBuffer[] = [
                        'player_id' => $playerId,
                        'team_id' => $teamId,
                        'competition_id' => $competitionId,
                        'season_id' => $seasonId,
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
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    if (count($seasonStatsBuffer) >= 1000) {
                        DB::table('player_season_stats')->insert($seasonStatsBuffer);
                        $seasonStatsBuffer = [];
                    }
                }
            }

            // 4. Process Career Summaries
            $summaryEntries = $playerData['career_summary'] ?? [];
            foreach ($summaryEntries as $summary) {
                $teamId = !empty($summary['team_slug']) ? ($teamsMap[$summary['team_slug']] ?? null) : null;

                $summariesBuffer[] = [
                    'player_id' => $playerId,
                    'team_id' => $teamId,
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
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if (count($summariesBuffer) >= 1000) {
                    DB::table('player_career_summaries')->insert($summariesBuffer);
                    $summariesBuffer = [];
                }
            }
        }

        // Flush remaining buffer leftovers
        if (!empty($seasonStatsBuffer)) {
            DB::table('player_season_stats')->insert($seasonStatsBuffer);
            unset($seasonStatsBuffer);
        }

        if (!empty($summariesBuffer)) {
            DB::table('player_career_summaries')->insert($summariesBuffer);
            unset($summariesBuffer);
        }
    }
}