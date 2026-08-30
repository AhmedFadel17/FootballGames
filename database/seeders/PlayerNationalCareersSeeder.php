<?php
namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use JsonMachine\Items;
use JsonMachine\JsonDecoder\ExtJsonDecoder;

class PlayerNationalCareersSeeder extends Seeder
{
    public function run(): void
    {
        ini_set('memory_limit', '1024M');
        DB::disableQueryLog();

        // 1. Pre-load lookup maps into memory
        $playersMap = DB::table('players')->pluck('id', 'slug')->all();
        $teamsMap = DB::table('teams')->pluck('id', 'slug')->all();
        $competitionsMap = DB::table('competitions')->pluck('id', 'slug')->all();
        $seasonsMap = DB::table('seasons')->pluck('id', 'name')->all();

        $filePath = Storage::disk('public')->path('data/national_careers_over_60.json');
        $playersData = Items::fromFile($filePath, [
            'decoder' => new ExtJsonDecoder(true)
        ]);

        $seasonStatsBuffer = [];
        $rawPeriodsPerPlayer = [];
        $marketValueUpdates = [];
        $now = now()->toDateTimeString();
        $todayDate = now()->toDateString();
        $currentYear = (int) now()->format('Y');

        foreach ($playersData as $playerData) {
            $playerId = $playersMap[$playerData['player_slug'] ?? ''] ?? null;
            if (!$playerId) {
                continue;
            }

            // Convert market value from millions (e.g., 2.5 => 2500000) for players.market_value
            if (isset($playerData['market_value_mil_eur']) && $playerData['market_value_mil_eur'] !== null) {
                $milValue = (float) $playerData['market_value_mil_eur'];
                $marketValueUpdates[$playerId] = (int) round($milValue * 1_000_000);
            }

            // Merge club and national career entries
            $clubCareer = $playerData['career'] ?? [];
            $nationalCareer = $playerData['national_career'] ?? [];
            $allCareerEntries = array_merge($clubCareer, $nationalCareer);

            foreach ($allCareerEntries as $entry) {
                $teamSlug = $entry['club_slug'] ?? $entry['team_slug'] ?? null;
                $teamId = !empty($teamSlug) ? ($teamsMap[$teamSlug] ?? null) : null;
                $competitionId = !empty($entry['competition_slug']) ? ($competitionsMap[$entry['competition_slug']] ?? null) : null;
                $seasonName = $entry['season'] ?? null;
                $seasonId = !empty($seasonName) ? ($seasonsMap[$seasonName] ?? null) : null;

                // 2. Insert into player_season_stats
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

                // 3. Collect Raw Data for Player Team Periods
                if ($teamId && $seasonName) {
                    $startDate = $this->extractStartDateFromSeason($seasonName);

                    if ($startDate && $startDate <= $todayDate) {
                        $rawPeriodsPerPlayer[$playerId][] = [
                            'player_id' => $playerId,
                            'team_id' => $teamId,
                            'start_date' => $startDate,
                        ];
                    }
                }

                if (count($seasonStatsBuffer) >= 1000) {
                    DB::table('player_season_stats')->insert($seasonStatsBuffer);
                    $seasonStatsBuffer = [];
                }
            }
        }

        // Flush remaining season stats
        if (!empty($seasonStatsBuffer)) {
            DB::table('player_season_stats')->insert($seasonStatsBuffer);
            unset($seasonStatsBuffer);
        }

        // 4. Smart Gap Detection: Generate Player Team Periods
        $periodsBuffer = [];
        foreach ($rawPeriodsPerPlayer as $playerId => $periods) {
            // Sort entries chronologically by start date
            usort($periods, fn($a, $b) => strcmp($a['start_date'], $b['start_date']));

            $stints = [];
            $currentStint = null;

            foreach ($periods as $p) {
                $pYear = (int) Carbon::parse($p['start_date'])->format('Y');

                if (!$currentStint) {
                    $currentStint = [
                        'player_id' => $p['player_id'],
                        'team_id' => $p['team_id'],
                        'start_date' => $p['start_date'],
                        'last_year' => $pYear,
                    ];
                    continue;
                }

                $isSameTeam = ($currentStint['team_id'] === $p['team_id']);
                $isConsecutiveYear = ($pYear - $currentStint['last_year'] <= 1);

                if ($isSameTeam && $isConsecutiveYear) {
                    // Extend current continuous stint
                    $currentStint['last_year'] = $pYear;
                } else {
                    // Close previous stint and open a new stint
                    $stints[] = $currentStint;
                    $currentStint = [
                        'player_id' => $p['player_id'],
                        'team_id' => $p['team_id'],
                        'start_date' => $p['start_date'],
                        'last_year' => $pYear,
                    ];
                }
            }

            if ($currentStint) {
                $stints[] = $currentStint;
            }

            // Write Stints into Database Buffer
            foreach ($stints as $stint) {
                // Period is current ONLY if its last active season is within the current active year
                $isCurrent = ($stint['last_year'] >= $currentYear);
                $endDate = $isCurrent ? null : "{$stint['last_year']}-12-31";

                $periodsBuffer[] = [
                    'player_id' => $stint['player_id'],
                    'team_id' => $stint['team_id'],
                    'start_date' => $stint['start_date'],
                    'end_date' => $endDate,
                    'is_loan' => false,
                    'is_current' => $isCurrent,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if (count($periodsBuffer) >= 1000) {
                    DB::table('player_team_periods')->insert($periodsBuffer);
                    $periodsBuffer = [];
                }
            }
        }

        if (!empty($periodsBuffer)) {
            DB::table('player_team_periods')->insert($periodsBuffer);
            unset($periodsBuffer);
        }

        // 5. Bulk Update market_value on players table
        if (!empty($marketValueUpdates)) {
            $this->bulkUpdateMarketValues($marketValueUpdates);
        }
    }

    private function extractStartDateFromSeason(string $seasonStr): ?string
    {
        $seasonStr = trim($seasonStr);

        if (str_contains($seasonStr, '/')) {
            $parts = explode('/', $seasonStr);
            $year = trim($parts[0]);
            if (strlen($year) === 2) {
                $year = '20' . $year;
            }
            return is_numeric($year) ? "{$year}-07-01" : null;
        }

        if (is_numeric($seasonStr) && strlen($seasonStr) === 4) {
            return "{$seasonStr}-01-01";
        }

        return null;
    }

    private function bulkUpdateMarketValues(array $updates): void
    {
        $chunks = array_chunk($updates, 1000, true);

        foreach ($chunks as $chunk) {
            $cases = [];
            $ids = [];

            foreach ($chunk as $playerId => $value) {
                $cases[] = "WHEN {$playerId} THEN {$value}";
                $ids[] = $playerId;
            }

            $idsString = implode(',', $ids);
            $casesString = implode(' ', $cases);

            $sql = "UPDATE players 
                    SET market_value = CASE id {$casesString} END 
                    WHERE id IN ({$idsString})";

            DB::statement($sql);
        }
    }
}