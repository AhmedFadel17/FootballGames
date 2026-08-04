<?php

namespace Database\Seeders;

use App\Models\Core\Competition;
use App\Models\Core\CompetitionSeason;
use App\Models\Core\Country;
use App\Models\Core\Season;
use App\Models\Core\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        Team::truncate();
        $json = Storage::disk('public')->get('data/full_teams.json');
        $teams = json_decode($json, true);

        foreach ($teams as $teamData) {
            $country = Country::where('code', strtoupper($teamData['country_code'] ?? ''))->first();
            if (!$country) {
                continue;
            }

            $id = $teamData['team_id'] ?? null;
            $imgSrc = $id ? "https://cdn.resfu.com/img_data/equipos/" . $id . ".png?size=120x&lossy=1" : null;

            $team = Team::updateOrCreate(
                ['slug' => $teamData['team_slug']],
                [
                    'name' => $teamData['name'],
                    'country_id' => $country->id,
                    'img_src' => $imgSrc,
                    'api_id' => $id,
                ]
            );

            $titles = $teamData['honours'] ?? [];
            foreach ($titles as $title) {
                $competition = Competition::where('name', $title['name'])->first();
                if (!$competition) {
                    continue;
                }

                $seasons = $title['seasons'] ?? [];
                foreach ($seasons as $seasonStr) {
                    $years = $this->parseSeasonYears((string) $seasonStr);

                    // Find or create the season record
                    $s = Season::firstOrCreate(
                        ['name' => (string) $seasonStr],
                        [
                            'start_year' => $years['start'],
                            'end_year' => $years['end'],
                        ]
                    );

                    // Set the team as the winner of this competition season
                    CompetitionSeason::updateOrCreate(
                        [
                            'competition_id' => $competition->id,
                            'season_id' => $s->id,
                        ],
                        [
                            'winner_team_id' => $team->id,
                        ]
                    );
                }
            }
        }
    }

    /**
     * Parse season strings like "2007-08", "2007/2008", or "2007" into start and end years.
     *
     * @return array{start: int, end: int}
     */
    private function parseSeasonYears(string $seasonStr): array
    {
        // Split by delimiter '-' or '/'
        $parts = preg_split('/[-\/]/', trim($seasonStr));

        if (count($parts) === 2) {
            $start = (int) $parts[0];
            $endPart = trim($parts[1]);

            // Handle 2-digit end year like "08" -> 2008
            if (strlen($endPart) === 2) {
                $prefix = substr((string) $start, 0, 2);
                $end = (int) ($prefix . $endPart);
            } else {
                $end = (int) $endPart;
            }

            return ['start' => $start, 'end' => $end];
        }

        // Single year format e.g., "2007"
        $year = (int) $seasonStr;
        return ['start' => $year, 'end' => $year];
    }
}