<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Core\Player;
use App\Models\Core\Team;
use App\Models\Core\PlayerTeamPeriod;
use App\Models\Core\Country;
use Illuminate\Support\Facades\Storage;

class PlayersSeeder extends Seeder
{
    public function run(): void
    {
        Player::truncate();

        $json = Storage::disk('public')->get('data/players.json');
        $data = json_decode($json, true);


        foreach ($data as $playerData) {
            // Find country (optional)
            $country = Country::where('code', strtoupper($playerData['nationality']))->first();


            // Insert player
            $player = Player::updateOrCreate(
                ['slug' => $playerData['slug']],
                [
                    'name' => $playerData['name'],
                    'fullname' => $playerData['name'],
                    'position' => (int) $playerData['position_id'],
                    'date_of_birth' => (!empty($playerData['date_of_birth']) && strtolower($playerData['date_of_birth']) !== 'unknown')
                        ? $playerData['date_of_birth']
                        : null,
                    'country_id' => $country->id ?? null,
                    'height_cm' => $playerData['height_cm'],
                    'weight_kg' => $playerData['weight_kg'],
                    'preferred_foot' => (int) $playerData['preferred_foot'],
                    'img_src' => $playerData['image_url'],
                    'popularity' => min(100, $playerData['rating'] + 10),
                    'rating' => $playerData['rating'],
                    'market_value' => $playerData['market_value'],
                    'api_id' => $playerData['id'],

                ]
            );



        }

        $this->command->info("🎉 Players and team periods seeding completed.");
    }
}
