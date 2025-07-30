<?php

namespace Database\Seeders;

use App\Models\Core\Continent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ContinentSeeder extends Seeder
{
    public function run(): void
    {
        $json = Storage::disk('public')->get('data/continents.json');
        $continents = json_decode($json, true);
        foreach ($continents as $row) {
            Continent::updateOrCreate(
                ['name' => $row['name']],
                [
                    'code' => $row['code'],
                ]
            );
        }
    }
}
