<?php

namespace Database\Seeders;

use App\Enums\Core\TeamType;
use App\Models\Core\Competition;
use App\Models\Core\Player;
use App\Models\Core\PlayerCareerSummary;
use App\Models\Core\PlayerSeasonStat;
use App\Models\Core\Season;
use App\Models\Core\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateNationalTeamStatsSeeder extends Seeder
{
    public function run(): void
    {
        DB::disableQueryLog();
        ini_set('memory_limit', '512M');
        Player::with(['careerSummaries'])->chunk(500, function ($players) {
            foreach ($players as $player) {
                $nationalStats = $player->careerSummaries->whereNotNull('team_id')->first();

                if (!$nationalStats) {
                    continue;
                }
                $nationalTeam = Team::where('type', TeamType::NATIONAL)->where('country_id', $player->country_id)->first();
                if ($nationalTeam) {
                    $nationalStats->update([
                        'team_id' => $nationalTeam->id,
                    ]);
                }
            }
        });
    }
}