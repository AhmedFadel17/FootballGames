<?php
namespace App\Services\Packs\Packs;

use App\DTOs\Packs\OpenPackRequestDTO;
use App\DTOs\Packs\PackDTO;
use App\DTOs\Pagination\PaginationDTO;
use App\Models\Packs\Cosmetic;
use App\Models\Packs\Pack;
use App\Models\Packs\PlayerCard;
use App\Models\Packs\Powerup;
use App\Models\Packs\UserCard;
use App\Models\Packs\UserPackOpening;
use App\Models\Packs\UserPowerup;
use App\Models\User;
use App\Services\Pagination\IPaginationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PackService implements IPackService
{
    public function __construct(private IPaginationService $_paginationService)
    {
    }

    public function getAll(PaginationDTO $dto): LengthAwarePaginator
    {
        return $this->_paginationService
            ->for(Pack::query()->with(['dropRules', 'event']), $dto)
            ->allowFilters(['id', 'name', 'is_active', 'price_coins'])
            ->allowSorts(['id', 'name', 'price_coins', 'created_at'])
            ->searchable(['name', 'description'])
            ->paginate();
    }

    public function getOptions(?string $query = null, ?int $limit = 10): Collection
    {
        $term = trim($query);
        $searchable = strlen($term) >= 2;

        return Pack::query()
            ->select(['id', 'name', 'price_coins', 'cards_count', 'img_src'])
            ->where('is_active', true)
            ->when($searchable, function ($q) use ($term) {
                $q->where('name', 'ILIKE', "%{$term}%");
            })
            ->orderBy('price_coins', 'asc')
            ->limit($limit)
            ->get();
    }

    public function getById($id): Pack
    {
        return Pack::with(['event', 'dropRules'])->findOrFail($id);
    }

    public function create(PackDTO $data): Pack
    {
        $pack = Pack::create($data->toArray());
        $pack->load('event');
        return $pack;
    }

    public function update($id, PackDTO $data): Pack
    {
        $pack = Pack::findOrFail($id);
        $pack->update($data->toUpdateArray());
        $pack->load('event');
        return $pack;
    }

    public function delete($id): bool
    {
        $pack = Pack::findOrFail($id);
        $pack->delete();
        return true;
    }

    public function openPack(OpenPackRequestDTO $dto): array
    {
        return DB::transaction(function () use ($dto) {
            $pack = Pack::with(['dropRules', 'event'])->findOrFail($dto->packId);
            $user = User::findOrFail($dto->userId);

            if ($user->coins < $pack->price_coins) {
                abort(422, 'Insufficient coins to open this pack.');
            }

            if ($pack->required_level > 0 && ($user->level ?? 1) < $pack->required_level) {
                abort(422, "Required level {$pack->required_level} not reached.");
            }

            $dropRules = $pack->dropRules;
            $items = [];
            $earnedCoins = 0;
            $cardsToRoll = max(1, $pack->cards_count);

            for ($i = 0; $i < $cardsToRoll; $i++) {
                $selectedRule = $this->selectDropRule($dropRules);
                $dropType = $selectedRule?->drop_type ?? 'player_card';

                if ($dropType === 'coins' || $pack->cards_count === 0) {
                    $min = $selectedRule?->min_coins ?: 100;
                    $max = max($min, $selectedRule?->max_coins ?: 500);
                    $coinAmount = rand($min, $max);
                    $earnedCoins += $coinAmount;
                    $items[] = [
                        'type' => 'coins',
                        'amount' => $coinAmount,
                        'model' => [
                            'name' => "{$coinAmount} Coins",
                            'amount' => $coinAmount,
                        ],
                    ];
                } elseif ($dropType === 'powerup') {
                    $powerupQuery = Powerup::query();
                    if ($selectedRule?->rarity) {
                        $powerupQuery->where('rarity', $selectedRule->rarity);
                    }
                    $powerup = $powerupQuery->inRandomOrder()->first() ?? Powerup::inRandomOrder()->first();

                    if ($powerup) {
                        $userPowerup = UserPowerup::firstOrNew([
                            'user_id' => $user->id,
                            'powerup_id' => $powerup->id,
                        ]);
                        $userPowerup->quantity = ($userPowerup->quantity ?? 0) + 1;
                        $userPowerup->save();

                        $items[] = [
                            'type' => 'powerup',
                            'model' => $powerup,
                        ];
                    }
                } elseif ($dropType === 'cosmetic') {
                    $cosmeticQuery = Cosmetic::query();
                    if ($selectedRule?->rarity) {
                        $cosmeticQuery->where('rarity', $selectedRule->rarity);
                    }
                    $cosmetic = $cosmeticQuery->inRandomOrder()->first() ?? Cosmetic::inRandomOrder()->first();

                    if ($cosmetic) {
                        $userCard = UserCard::firstOrNew([
                            'user_id' => $user->id,
                            'cardable_type' => Cosmetic::class,
                            'cardable_id' => $cosmetic->id,
                        ]);
                        $userCard->quantity = ($userCard->quantity ?? 0) + 1;
                        $userCard->obtained_at = now();
                        $userCard->save();

                        $items[] = [
                            'type' => 'cosmetic',
                            'model' => $cosmetic,
                        ];
                    }
                } else {
                    // Default: player_card
                    $cardQuery = PlayerCard::with(['player', 'event'])->where('is_packable', true);

                    if ($selectedRule?->event_id) {
                        $cardQuery->where('event_id', $selectedRule->event_id);
                    }

                    if ($selectedRule?->rarity) {
                        $cardQuery->where('rarity', $selectedRule->rarity);
                    }

                    $card = $cardQuery->inRandomOrder()->first();

                    // Fallback to any packable player card if strict match isn't found
                    if (!$card) {
                        $card = PlayerCard::with(['player', 'event'])
                            ->where('is_packable', true)
                            ->inRandomOrder()
                            ->first();
                    }

                    if ($card) {
                        $userCard = UserCard::firstOrNew([
                            'user_id' => $user->id,
                            'cardable_type' => PlayerCard::class,
                            'cardable_id' => $card->id,
                        ]);
                        $userCard->quantity = ($userCard->quantity ?? 0) + 1;
                        $userCard->obtained_at = now();
                        $userCard->save();

                        $items[] = [
                            'type' => 'player_card',
                            'model' => $card,
                        ];
                    }
                }
            }

            // Update user balance
            $user->coins = max(0, $user->coins - $pack->price_coins + $earnedCoins);
            $user->save();

            // Record opening
            UserPackOpening::create([
                'user_id' => $user->id,
                'pack_id' => $pack->id,
                'coins_spent' => $pack->price_coins,
                'dropped_items' => json_encode(array_map(function ($item) {
                    return [
                        'type' => $item['type'],
                        'amount' => $item['amount'] ?? null,
                        'id' => is_object($item['model']) ? ($item['model']->id ?? null) : null,
                    ];
                }, $items)),
            ]);

            return [
                'pack_id' => $pack->id,
                'pack' => $pack,
                'user_coins' => $user->coins,
                'coins_spent' => $pack->price_coins,
                'coins_earned' => $earnedCoins,
                'items' => $items,
            ];
        });
    }

    private function selectDropRule($dropRules)
    {
        if (!$dropRules || $dropRules->isEmpty()) {
            return null;
        }

        $totalWeight = $dropRules->sum('drop_percentage');
        if ($totalWeight <= 0) {
            return $dropRules->random();
        }

        $rand = (float) rand(1, 10000) / 100.0;
        $current = 0;

        foreach ($dropRules as $rule) {
            $current += (float) $rule->drop_percentage;
            if ($rand <= $current) {
                return $rule;
            }
        }

        return $dropRules->last();
    }
}