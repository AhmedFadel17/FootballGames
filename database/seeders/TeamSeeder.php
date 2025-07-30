<?php

namespace Database\Seeders;

use App\Models\Core\Country;
use Illuminate\Database\Seeder;
use App\Models\Core\Team;
use Illuminate\Support\Facades\Storage;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $json = Storage::disk('public')->get('data/epl_teams.json');
        $teams = json_decode($json, true);
        $england = Country::where('name', 'United Kingdom')->orWhere('name', 'England')->first();

        foreach ($teams as $teamData) {
            Team::updateOrCreate(
                ['name' => $teamData['name']],
                [
                    'short_name' => $teamData['shortName'] ?? null,
                    'abbr' => $teamData['abbr'] ?? null,
                    'country_id' => $england->id,
                    'api_id'=>$teamData['id']
                ]
            );
        }
    }
}
