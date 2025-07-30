<?php

namespace Database\Seeders;

use App\Models\Core\Continent;
use App\Models\Core\Season;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class SeasonSeeder extends Seeder
{
    public function run(): void
    {
        $json = Storage::disk('public')->get('data/seasons.json');
        $seasons = json_decode($json, true);
        foreach ($seasons as $season) {
             Season::updateOrCreate(
                ['name' => $season['name']], // Prevent duplicates
                [
                    'start_year' => $season['start_year'],
                    'end_year'   => $season['end_year'],
                ]
            );
        }
    }
}
