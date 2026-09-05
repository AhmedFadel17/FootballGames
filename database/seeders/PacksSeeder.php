<?php

namespace Database\Seeders;

use App\Enums\Packs\CardRarity;
use App\Enums\Packs\CosmeticType;
use App\Enums\Packs\PackLimitType;
use App\Enums\Packs\PowerupType;
use App\Models\Core\Player;
use App\Models\Packs\Cosmetic;
use App\Models\Packs\Event;
use App\Models\Packs\Pack;
use App\Models\Packs\PackDropRule;
use App\Models\Packs\PlayerCard;
use App\Models\Packs\Powerup;
use Illuminate\Database\Seeder;

class PacksSeeder extends Seeder
{
    /**
     * Seed the Packs domain: Events → PlayerCards → Packs → PackDropRules.
     */
    public function run(): void
    {
        // ─── 1. Clean up existing data (child-first to respect FK constraints) ──
        PackDropRule::query()->delete();
        PlayerCard::query()->delete();
        Pack::query()->delete();
        Event::query()->delete();
        Powerup::query()->delete();
        Cosmetic::query()->delete();

        $this->command->info('🧹  Cleared existing packs domain data.');

        // ─── 2. Events ────────────────────────────────────────────────────────
        $events = [
            [
                'slug'        => 'toty-2025',
                'name'        => 'Team of the Year 2025',
                'is_active'   => true,
                'start_date'  => now()->subDays(5),
                'end_date'    => now()->addDays(25),
                'theme_color' => '#FFD700',
                'img_src'     => null,
            ],
            [
                'slug'        => 'ucl-icons',
                'name'        => 'UCL Icons',
                'is_active'   => true,
                'start_date'  => now()->subDays(2),
                'end_date'    => now()->addDays(14),
                'theme_color' => '#0033A0',
                'img_src'     => null,
            ],
            [
                'slug'        => 'retro-legends',
                'name'        => 'Retro Legends',
                'is_active'   => false,
                'start_date'  => null,
                'end_date'    => null,
                'theme_color' => '#8B4513',
                'img_src'     => null,
            ],
        ];

        $createdEvents = [];
        foreach ($events as $data) {
            $createdEvents[$data['slug']] = Event::create($data);
        }

        $this->command->info('✅  Seeded ' . count($createdEvents) . ' events.');

        // ─── 3. Player Cards ───────────────────────────────────────────────────
        // Grab first 20 players from the DB; fall back gracefully if none seeded yet.
        $players = Player::query()->limit(20)->get();

        if ($players->isEmpty()) {
            $this->command->warn('⚠️  No players found — skipping PlayerCards seeding. Run PlayersSeeder first.');
        } else {
            $totyEvent  = $createdEvents['toty-2025'];
            $uclEvent   = $createdEvents['ucl-icons'];
            $retroEvent = $createdEvents['retro-legends'];

            // First 6 players → TOTY event (Special/Legend)
            foreach ($players->take(6) as $index => $player) {
                PlayerCard::create([
                    'player_id'   => $player->id,
                    'event_id'    => $totyEvent->id,
                    'rarity'      => $index < 2 ? CardRarity::SPECIAL->value : CardRarity::LEGEND->value,
                    'rating'      => 90 + $index,
                    'img_src'     => null,
                    'is_packable' => true,
                ]);
            }

            // Next 8 players → UCL Icons event (Legend/Rare)
            foreach ($players->slice(6, 8) as $index => $player) {
                PlayerCard::create([
                    'player_id'   => $player->id,
                    'event_id'    => $uclEvent->id,
                    'rarity'      => $index < 3 ? CardRarity::LEGEND->value : CardRarity::RARE->value,
                    'rating'      => 85 + $index,
                    'img_src'     => null,
                    'is_packable' => true,
                ]);
            }

            // Last 6 players → Retro Legends event (Rare/Common, not packable — event inactive)
            foreach ($players->slice(14, 6) as $index => $player) {
                PlayerCard::create([
                    'player_id'   => $player->id,
                    'event_id'    => $retroEvent->id,
                    'rarity'      => $index < 2 ? CardRarity::RARE->value : CardRarity::COMMON->value,
                    'rating'      => 78 + $index,
                    'img_src'     => null,
                    'is_packable' => false,
                ]);
            }

            $this->command->info('✅  Seeded ' . PlayerCard::count() . ' player cards.');
        }

        // ─── 4. Packs ─────────────────────────────────────────────────────────
        $packs = [
            [
                'slug'           => 'starter-pack',
                'name'           => 'Starter Pack',
                'description'    => 'A great pack for beginners. Contains 3 Common or Rare player cards.',
                'price_coins'    => 500,
                'cards_count'    => 3,
                'required_level' => 1,
                'user_limit'     => 5,
                'limit_type'     => PackLimitType::ALL_TIME->value,
                'img_src'        => null,
                'is_active'      => true,
            ],
            [
                'slug'           => 'gold-pack',
                'name'           => 'Gold Pack',
                'description'    => 'A premium pack guaranteeing at least one Rare card. 5 cards total.',
                'price_coins'    => 2500,
                'cards_count'    => 5,
                'required_level' => 5,
                'user_limit'     => 3,
                'limit_type'     => PackLimitType::WEEKLY->value,
                'img_src'        => null,
                'is_active'      => true,
            ],
            [
                'slug'           => 'toty-pack',
                'name'           => 'TOTY Pack',
                'description'    => 'Exclusive Team of the Year pack. Chance to pull a Legend or Special!',
                'price_coins'    => 7500,
                'cards_count'    => 5,
                'required_level' => 10,
                'user_limit'     => 1,
                'limit_type'     => PackLimitType::DAILY->value,
                'img_src'        => null,
                'is_active'      => true,
            ],
            [
                'slug'           => 'ucl-pack',
                'name'           => 'UCL Icons Pack',
                'description'    => 'Features UCL icon players. Rare+ guaranteed. Limited time only.',
                'price_coins'    => 5000,
                'cards_count'    => 5,
                'required_level' => 8,
                'user_limit'     => 2,
                'limit_type'     => PackLimitType::DAILY->value,
                'img_src'        => null,
                'is_active'      => true,
            ],
            [
                'slug'           => 'coin-pack',
                'name'           => 'Coin Reward Pack',
                'description'    => 'No cards — pure coin rewards ranging from 200 to 1500.',
                'price_coins'    => 1000,
                'cards_count'    => 0,
                'required_level' => 1,
                'user_limit'     => null,
                'limit_type'     => PackLimitType::ALL_TIME->value,
                'img_src'        => null,
                'is_active'      => true,
            ],
        ];

        $createdPacks = [];
        foreach ($packs as $data) {
            $createdPacks[$data['slug']] = Pack::create($data);
        }

        $this->command->info('✅  Seeded ' . count($createdPacks) . ' packs.');

        // ─── 5. Pack Drop Rules ────────────────────────────────────────────────
        $totyEventId = $createdEvents['toty-2025']->id;
        $uclEventId  = $createdEvents['ucl-icons']->id;

        $dropRules = [
            // ── Starter Pack: 70% Common, 30% Rare ──────────────────────────
            ['pack_id' => $createdPacks['starter-pack']->id, 'drop_type' => 'player_card', 'rarity' => CardRarity::COMMON->value, 'event_id' => null, 'min_coins' => 0,   'max_coins' => 0,    'drop_percentage' => 70.00],
            ['pack_id' => $createdPacks['starter-pack']->id, 'drop_type' => 'player_card', 'rarity' => CardRarity::RARE->value,   'event_id' => null, 'min_coins' => 0,   'max_coins' => 0,    'drop_percentage' => 30.00],

            // ── Gold Pack: 50% Rare, 30% Legend, 15% Coins, 5% Special ──────
            ['pack_id' => $createdPacks['gold-pack']->id,    'drop_type' => 'player_card', 'rarity' => CardRarity::RARE->value,    'event_id' => null, 'min_coins' => 0,   'max_coins' => 0,    'drop_percentage' => 50.00],
            ['pack_id' => $createdPacks['gold-pack']->id,    'drop_type' => 'player_card', 'rarity' => CardRarity::LEGEND->value,  'event_id' => null, 'min_coins' => 0,   'max_coins' => 0,    'drop_percentage' => 30.00],
            ['pack_id' => $createdPacks['gold-pack']->id,    'drop_type' => 'coins',        'rarity' => null,                       'event_id' => null, 'min_coins' => 100, 'max_coins' => 500,  'drop_percentage' => 15.00],
            ['pack_id' => $createdPacks['gold-pack']->id,    'drop_type' => 'player_card', 'rarity' => CardRarity::SPECIAL->value, 'event_id' => null, 'min_coins' => 0,   'max_coins' => 0,    'drop_percentage' => 5.00],

            // ── TOTY Pack: 40% Legend (TOTY), 10% Special (TOTY), 40% Rare, 10% Coins ──
            ['pack_id' => $createdPacks['toty-pack']->id,    'drop_type' => 'player_card', 'rarity' => CardRarity::LEGEND->value,  'event_id' => $totyEventId, 'min_coins' => 0,    'max_coins' => 0,    'drop_percentage' => 40.00],
            ['pack_id' => $createdPacks['toty-pack']->id,    'drop_type' => 'player_card', 'rarity' => CardRarity::SPECIAL->value, 'event_id' => $totyEventId, 'min_coins' => 0,    'max_coins' => 0,    'drop_percentage' => 10.00],
            ['pack_id' => $createdPacks['toty-pack']->id,    'drop_type' => 'player_card', 'rarity' => CardRarity::RARE->value,    'event_id' => null,         'min_coins' => 0,    'max_coins' => 0,    'drop_percentage' => 40.00],
            ['pack_id' => $createdPacks['toty-pack']->id,    'drop_type' => 'coins',        'rarity' => null,                       'event_id' => null,         'min_coins' => 500,  'max_coins' => 2000, 'drop_percentage' => 10.00],

            // ── UCL Pack: 50% Rare (UCL), 35% Legend (UCL), 15% Coins ───────
            ['pack_id' => $createdPacks['ucl-pack']->id,     'drop_type' => 'player_card', 'rarity' => CardRarity::RARE->value,   'event_id' => $uclEventId, 'min_coins' => 0,   'max_coins' => 0,   'drop_percentage' => 50.00],
            ['pack_id' => $createdPacks['ucl-pack']->id,     'drop_type' => 'player_card', 'rarity' => CardRarity::LEGEND->value, 'event_id' => $uclEventId, 'min_coins' => 0,   'max_coins' => 0,   'drop_percentage' => 35.00],
            ['pack_id' => $createdPacks['ucl-pack']->id,     'drop_type' => 'coins',        'rarity' => null,                      'event_id' => null,        'min_coins' => 200, 'max_coins' => 800, 'drop_percentage' => 15.00],

            // ── Coin Pack: 100% Coins ────────────────────────────────────────
            ['pack_id' => $createdPacks['coin-pack']->id,    'drop_type' => 'coins',        'rarity' => null,                      'event_id' => null,        'min_coins' => 200, 'max_coins' => 1500, 'drop_percentage' => 100.00],
        ];

        foreach ($dropRules as $rule) {
            PackDropRule::create($rule);
        }

        $this->command->info('✅  Seeded ' . count($dropRules) . ' pack drop rules.');

        // ─── 6. Powerups ──────────────────────────────────────────────────────
        $powerups = [
            // Coin Booster — boosts coin earnings per game
            ['slug' => 'coin-booster-common',   'name' => 'Coin Booster I',      'description' => 'Boost coin earnings by 25% for 1 hour.',          'type' => PowerupType::COIN_BOOSTER->value,    'rarity' => CardRarity::COMMON->value,  'duration' => 3600,  'multiplier' => 1.25, 'img_src' => null],
            ['slug' => 'coin-booster-rare',      'name' => 'Coin Booster II',     'description' => 'Boost coin earnings by 50% for 2 hours.',         'type' => PowerupType::COIN_BOOSTER->value,    'rarity' => CardRarity::RARE->value,    'duration' => 7200,  'multiplier' => 1.50, 'img_src' => null],
            ['slug' => 'coin-booster-legend',    'name' => 'Coin Booster III',    'description' => 'Boost coin earnings by 100% for 4 hours.',        'type' => PowerupType::COIN_BOOSTER->value,    'rarity' => CardRarity::LEGEND->value,  'duration' => 14400, 'multiplier' => 2.00, 'img_src' => null],

            // Score Multiplier — multiplies game score
            ['slug' => 'score-mult-common',      'name' => 'Score Multiplier I',  'description' => 'Multiply your score by 1.5x for the next game.',   'type' => PowerupType::SCORE_MULTIPLIER->value, 'rarity' => CardRarity::COMMON->value,  'duration' => 0,     'multiplier' => 1.50, 'img_src' => null],
            ['slug' => 'score-mult-rare',         'name' => 'Score Multiplier II', 'description' => 'Multiply your score by 2x for the next game.',    'type' => PowerupType::SCORE_MULTIPLIER->value, 'rarity' => CardRarity::RARE->value,    'duration' => 0,     'multiplier' => 2.00, 'img_src' => null],
            ['slug' => 'score-mult-legend',       'name' => 'Score Multiplier III','description' => 'Multiply your score by 3x for the next game.',    'type' => PowerupType::SCORE_MULTIPLIER->value, 'rarity' => CardRarity::LEGEND->value,  'duration' => 0,     'multiplier' => 3.00, 'img_src' => null],

            // Streak Shield — protects your win streak
            ['slug' => 'streak-shield-common',   'name' => 'Streak Shield I',     'description' => 'Protect your streak from 1 loss.',                 'type' => PowerupType::STREAK_SHIELD->value,   'rarity' => CardRarity::COMMON->value,  'duration' => 0,     'multiplier' => 1.00, 'img_src' => null],
            ['slug' => 'streak-shield-rare',      'name' => 'Streak Shield II',    'description' => 'Protect your streak from 2 consecutive losses.',   'type' => PowerupType::STREAK_SHIELD->value,   'rarity' => CardRarity::RARE->value,    'duration' => 0,     'multiplier' => 1.00, 'img_src' => null],
            ['slug' => 'streak-shield-legend',    'name' => 'Streak Shield III',   'description' => 'Protect your streak from 3 consecutive losses.',   'type' => PowerupType::STREAK_SHIELD->value,   'rarity' => CardRarity::LEGEND->value,  'duration' => 0,     'multiplier' => 1.00, 'img_src' => null],

            // Time Extender — adds extra seconds in timed games
            ['slug' => 'time-extender-common',   'name' => 'Time Extender I',     'description' => 'Add 10 extra seconds to your next timed game.',     'type' => PowerupType::TIME_EXTENDER->value,   'rarity' => CardRarity::COMMON->value,  'duration' => 10,    'multiplier' => 1.00, 'img_src' => null],
            ['slug' => 'time-extender-rare',      'name' => 'Time Extender II',    'description' => 'Add 20 extra seconds to your next timed game.',     'type' => PowerupType::TIME_EXTENDER->value,   'rarity' => CardRarity::RARE->value,    'duration' => 20,    'multiplier' => 1.00, 'img_src' => null],
            ['slug' => 'time-extender-legend',    'name' => 'Time Extender III',   'description' => 'Add 30 extra seconds to your next timed game.',     'type' => PowerupType::TIME_EXTENDER->value,   'rarity' => CardRarity::LEGEND->value,  'duration' => 30,    'multiplier' => 1.00, 'img_src' => null],
        ];

        foreach ($powerups as $data) {
            Powerup::create($data);
        }

        $this->command->info('✅  Seeded ' . count($powerups) . ' powerups.');

        // ─── 7. Cosmetics ─────────────────────────────────────────────────────
        $placeholder = 'images/placeholder.png';

        $cosmetics = [
            // Badges
            ['slug' => 'badge-champions',        'name' => 'Champions Badge',       'type' => CosmeticType::Badge->value,   'rarity' => CardRarity::RARE->value,    'img_src' => $placeholder],
            ['slug' => 'badge-legend',            'name' => 'Legend Badge',           'type' => CosmeticType::Badge->value,   'rarity' => CardRarity::LEGEND->value,  'img_src' => $placeholder],
            ['slug' => 'badge-rookie',            'name' => 'Rookie Badge',           'type' => CosmeticType::Badge->value,   'rarity' => CardRarity::COMMON->value,  'img_src' => $placeholder],

            // Jerseys
            ['slug' => 'jersey-home-classic',     'name' => 'Classic Home Jersey',    'type' => CosmeticType::Jersey->value,  'rarity' => CardRarity::COMMON->value,  'img_src' => $placeholder],
            ['slug' => 'jersey-gold-edition',     'name' => 'Gold Edition Jersey',    'type' => CosmeticType::Jersey->value,  'rarity' => CardRarity::RARE->value,    'img_src' => $placeholder],
            ['slug' => 'jersey-toty-special',     'name' => 'TOTY Special Jersey',    'type' => CosmeticType::Jersey->value,  'rarity' => CardRarity::SPECIAL->value, 'img_src' => $placeholder],

            // Stadiums
            ['slug' => 'stadium-wembley',         'name' => 'Wembley Night',          'type' => CosmeticType::Stadium->value, 'rarity' => CardRarity::RARE->value,    'img_src' => $placeholder],
            ['slug' => 'stadium-bernabeu',        'name' => 'Bernabéu Atmosphere',    'type' => CosmeticType::Stadium->value, 'rarity' => CardRarity::LEGEND->value,  'img_src' => $placeholder],
            ['slug' => 'stadium-local-pitch',     'name' => 'Local Pitch',            'type' => CosmeticType::Stadium->value, 'rarity' => CardRarity::COMMON->value,  'img_src' => $placeholder],

            // Balls
            ['slug' => 'ball-classic',            'name' => 'Classic Ball',           'type' => CosmeticType::Ball->value,    'rarity' => CardRarity::COMMON->value,  'img_src' => $placeholder],
            ['slug' => 'ball-golden',             'name' => 'Golden Ball',            'type' => CosmeticType::Ball->value,    'rarity' => CardRarity::RARE->value,    'img_src' => $placeholder],
            ['slug' => 'ball-ucl-official',       'name' => 'UCL Official Ball',      'type' => CosmeticType::Ball->value,    'rarity' => CardRarity::SPECIAL->value, 'img_src' => $placeholder],

            // Trophies
            ['slug' => 'trophy-bronze',           'name' => 'Bronze Trophy',          'type' => CosmeticType::Trophy->value,  'rarity' => CardRarity::COMMON->value,  'img_src' => $placeholder],
            ['slug' => 'trophy-silver',           'name' => 'Silver Trophy',          'type' => CosmeticType::Trophy->value,  'rarity' => CardRarity::RARE->value,    'img_src' => $placeholder],
            ['slug' => 'trophy-golden-boot',      'name' => 'Golden Boot Trophy',     'type' => CosmeticType::Trophy->value,  'rarity' => CardRarity::LEGEND->value,  'img_src' => $placeholder],
        ];

        foreach ($cosmetics as $data) {
            Cosmetic::create($data);
        }

        $this->command->info('✅  Seeded ' . count($cosmetics) . ' cosmetics.');
        $this->command->newLine();
        $this->command->info('🎉  Packs domain seeding complete!');
        $this->command->table(
            ['Entity', 'Count'],
            [
                ['Events',          Event::count()],
                ['Player Cards',    PlayerCard::count()],
                ['Packs',           Pack::count()],
                ['Pack Drop Rules', PackDropRule::count()],
                ['Powerups',        Powerup::count()],
                ['Cosmetics',       Cosmetic::count()],
            ]
        );
    }
}
