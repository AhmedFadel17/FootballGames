<?php

namespace Database\Seeders;

use App\Models\Core\Competition;
use App\Models\Core\CompetitionSeason;
use App\Models\Core\Country;
use App\Models\Core\Season;
use App\Models\Core\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class UpdateTeamsSeeder extends Seeder
{
    public function run(): void
    {
        $json = Storage::disk('public')->get('data/teams.json');
        $teams = json_decode($json, true);

        foreach ($teams as $teamData) {
            $team = Team::where('slug', $teamData['slug'])->first();
            if (!$team) {
                continue;
            }

            $id = $teamData['id'] ?? null;
            $imgSrc = $id ? "https://cdn.resfu.com/img_data/equipos/" . $id . ".png?size=120x&lossy=1" : null;

            $team->update(
                [
                    'img_src' => $imgSrc,
                    'api_id' => $id,
                ]
            );
        }
    }

}