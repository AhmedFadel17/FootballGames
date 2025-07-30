<?php

namespace Database\Seeders;

use App\Models\Core\Continent;
use App\Models\Core\Country;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CountriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = Storage::disk('public')->get('data/countries.json');
        $countries = json_decode($json, true);

        foreach ($countries as $countryData) {
            $continent = Continent::firstOrCreate([
                'name' => $countryData['continent']
            ]);

            Country::updateOrCreate(
                ['name' => $countryData['name']],
                [
                    'code' => $countryData['code'],
                    'continent_id' => $continent->id,
                ]
            );
        }
    }
}
