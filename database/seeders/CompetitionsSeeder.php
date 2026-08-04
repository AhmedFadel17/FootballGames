<?php

namespace Database\Seeders;

use App\Models\Core\Competition;
use Illuminate\Database\Seeder;
use App\Models\Core\Country;
use Illuminate\Support\Facades\Storage;

class CompetitionsSeeder extends Seeder
{
    public function run(): void
    {
        Competition::truncate();
        $json = Storage::disk('public')->get('data/competitions.json');
        $competitions = json_decode($json, true);

        foreach ($competitions as $competitionData) {
            $country = Country::where([
                'code' => strtoupper($competitionData['country_code'])
            ])->first();

            if (!$country) {
                continue;
            }

            $abbr = "";

            $id = $competitionData['competition_id'];
            $imgSrc = $id ? "https://cdn.resfu.com/img_data/competiciones/logo/" . $id . ".png?size=120x&lossy=1" : null;

            Competition::updateOrCreate(
                ['slug' => $competitionData['competition_slug']],
                [
                    'name' => $competitionData['name'],
                    'country_id' => $country->id,
                    'abbr' => $abbr,
                    'type' => 1,
                    // 'founded_year' => $competitionData['founded_year'],
                    // 'tier' => $competitionData['tier'],
                    'img_src' => $imgSrc,
                    // 'is_active' => $competitionData['is_active'],
                    'api_id' => $competitionData['competition_id'],
                ]
            );
        }
    }
}
