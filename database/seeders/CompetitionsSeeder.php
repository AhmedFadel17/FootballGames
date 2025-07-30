<?php

namespace Database\Seeders;

use App\Models\Core\Competition;
use Illuminate\Database\Seeder;
use App\Models\Core\Country;

class CompetitionsSeeder extends Seeder
{
    public function run(): void
    {
        $england = Country::where('name', 'United Kingdom')->orWhere('name', 'England')->first();

        if (!$england) {
            $england = Country::create(['name' => 'England', 'code' => 'ENG']);
        }

        Competition::updateOrCreate([
            'name' => 'English Premier League',
        ], [
            'short_name' => 'EPL',
            'type' => 'league',
            'founded_year' => 1992,
            'tier' => 1,
            'img_src' => 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
            'is_active' => true,
            'country_id' => $england->id
        ]);
    }
}
