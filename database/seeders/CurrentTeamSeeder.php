<?php

namespace Database\Seeders;

use App\Models\Core\Manager;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CurrentTeamSeeder extends Seeder
{
    public function run(): void
    {
        ini_set('memory_limit', '512M');
        DB::disableQueryLog();

        $activeCount = 0;
        $retiredCount = 0;
        $noPeriodsCount = 0;

        $today = Carbon::today();

        // Process all managers in manageable chunks
        Manager::with([
            'teamPeriods' => function ($query) {
                $query->orderBy('start_date', 'desc');
            }
        ])->chunk(500, function ($managers) use ($today, &$activeCount, &$retiredCount, &$noPeriodsCount) {
            foreach ($managers as $manager) {
                $latestPeriod = $manager->teamPeriods->first();

                if (!$latestPeriod) {
                    // Manager has no recorded team periods
                    $noPeriodsCount++;
                    continue;
                }

                // A manager is active if end_date is null OR contract ends in the future (>= today)
                $endDate = $latestPeriod->end_date ? Carbon::parse($latestPeriod->end_date) : null;
                $isActive = is_null($endDate) || $endDate->greaterThanOrEqualTo($today);

                if ($isActive) {
                    $manager->update([
                        'is_retired' => false,
                        'current_team_id' => $latestPeriod->team_id,
                    ]);
                    $activeCount++;
                } else {
                    $manager->update([
                        'is_retired' => true,
                        'current_team_id' => null,
                    ]);
                    $retiredCount++;
                }
            }
        });

        // Summary logging
        $summary = "Update complete: {$activeCount} active managers, {$retiredCount} retired managers, and {$noPeriodsCount} managers without team periods.";
        $this->command->info($summary);
        Log::info($summary);
    }
}

