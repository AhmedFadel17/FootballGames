<?php

namespace Database\Seeders;

use App\Enums\Core\TeamType;
use App\Models\Core\Competition;
use App\Models\Core\CompetitionSeason;
use App\Models\Core\Country;
use App\Models\Core\Player;
use App\Models\Core\PlayerTeamPeriod;
use App\Models\Core\Season;
use App\Models\Core\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class CurrentTeamSeeder extends Seeder
{
    public function run(): void
    {
        ini_set('memory_limit', '512M');

        $activeCount = 0;
        $retiredCount = 0;
        $noPeriodsCount = 0;

        Player::with([
            'teamPeriods' => function ($query) {
                $query->orderBy('start_date', 'desc');
            }
        ])->chunk(500, function ($players) use (&$activeCount, &$retiredCount, &$noPeriodsCount) {
            foreach ($players as $player) {
                $latestPeriod = $player->teamPeriods->first();

                if (!$latestPeriod) {
                    $noPeriodsCount++;
                    continue;
                }

                $isActive = is_null($latestPeriod->end_date);

                if ($isActive) {
                    $player->update([
                        'is_retired' => false,
                        'current_team_id' => $latestPeriod->team_id,
                    ]);
                    $activeCount++;
                } else {
                    $player->update([
                        'is_retired' => true,
                        'current_team_id' => null,
                    ]);
                    $retiredCount++;
                }
            }
        });

        $summary = "Update complete: {$activeCount} active players, {$retiredCount} retired players, and {$noPeriodsCount} players without team periods.";
        $this->command->info($summary);
    }
}