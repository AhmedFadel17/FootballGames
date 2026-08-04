<?php

namespace Database\Seeders;

use App\Models\Core\Manager;
use App\Models\Core\ManagerTeamPeriod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Core\Player;
use App\Models\Core\Team;
use App\Models\Core\PlayerTeamPeriod;
use App\Models\Core\Country;
use Illuminate\Support\Facades\Storage;

class ManagersSeeder extends Seeder
{
    public function run(): void
    {
        Manager::truncate();
        ManagerTeamPeriod::truncate();
        $json = Storage::disk('public')->get('data/managers.json');
        $data = json_decode($json, true);


        foreach ($data as $playerData) {
            $country = Country::where('code', strtoupper($playerData['nationality']))->first();

            $manager = Manager::updateOrCreate(
                ['slug' => $playerData['slug']],
                [
                    'name' => $playerData['name'],
                    'country_id' => $country->id ?? null,
                    'img_src' => $playerData['image_url'],
                    'api_id' => $playerData['id'],
                ]
            );

            $teams = $playerData['teams'] ?? [];
            foreach ($teams as $teamData) {
                $team = Team::where('slug', $teamData['team_slug'])
                    ->orWhere('api_id', $teamData['team_id'])
                    ->first();

                if ($team) {
                    ManagerTeamPeriod::create(
                        [
                            'manager_id' => $manager->id,
                            'team_id' => $team->id,
                            'start_date' => $teamData['start_date'],
                            'end_date' => $teamData['end_date'],
                        ]
                    );
                }


            }

        }

    }
}
