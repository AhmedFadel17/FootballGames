<?php

namespace App\Http\Controllers\Packs;

use App\DTOs\Packs\OpenPackRequestDTO;
use App\Http\Controllers\Controller;
use App\Models\Packs\Cosmetic;
use App\Models\Packs\Pack;
use App\Models\Packs\PlayerCard;
use App\Models\Packs\Powerup;
use App\Models\Packs\UserCard;
use App\Models\Packs\UserPowerup;
use App\Models\UserSetting;
use App\Resources\Packs\CosmeticResource;
use App\Resources\Packs\PackOpeningResource;
use App\Resources\Packs\PackResource;
use App\Resources\Packs\PowerupResource;
use App\Services\Packs\Packs\IPackService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserStoreController extends Controller
{
    use ApiResponses;

    public function __construct(private IPackService $_packService)
    {
    }

    /**
     * Get active packs available in the store.
     */
    public function packs(): JsonResponse
    {
        $packs = Pack::query()
            ->with(['event', 'dropRules'])
            ->where('is_active', true)
            ->orderBy('price_coins', 'asc')
            ->get();

        return $this->successResponse(PackResource::collection($packs), 'Store packs fetched successfully');
    }

    /**
     * Get active powerups available in the store.
     */
    public function powerups(): JsonResponse
    {
        $powerups = Powerup::query()
            ->orderBy('rarity', 'asc')
            ->get();

        return $this->successResponse(PowerupResource::collection($powerups), 'Store powerups fetched successfully');
    }

    /**
     * Get active cosmetics available in the store.
     */
    public function cosmetics(): JsonResponse
    {
        $cosmetics = Cosmetic::query()
            ->orderBy('rarity', 'asc')
            ->get();

        return $this->successResponse(CosmeticResource::collection($cosmetics), 'Store cosmetics fetched successfully');
    }

    /**
     * Open a pack for the authenticated user.
     */
    public function openPack(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pack_id' => ['required', 'exists:packs,id'],
        ]);

        $dto = new OpenPackRequestDTO(
            userId: $request->user()->id,
            packId: (int) $validated['pack_id'],
        );

        $result = $this->_packService->openPack($dto);

        return $this->successResponse(new PackOpeningResource($result), 'Pack opened successfully');
    }

    /**
     * Get user's collected player cards.
     */
    public function myCards(Request $request): JsonResponse
    {
        $userCards = UserCard::query()
            ->where('user_id', $request->user()->id)
            ->where('cardable_type', PlayerCard::class)
            ->with([
                'cardable' => function ($query) {
                    $query->with(['player.country', 'event']);
                },
            ])
            ->orderByDesc('obtained_at')
            ->get()
            ->map(function ($item) {
                $card = $item->cardable;
                if (!$card) {
                    return null;
                }

                return [
                    'user_card_id' => $item->id,
                    'quantity' => $item->quantity,
                    'obtained_at' => $item->obtained_at?->toIso8601String(),
                    'id' => $card->id,
                    'player_id' => $card->player_id,
                    'event_id' => $card->event_id,
                    'rarity' => $card->rarity?->value ?? $card->rarity,
                    'rating' => $card->rating,
                    'position' => $card->position ?? $card->player?->position,
                    'img_src' => $card->img_src ?? $card->player?->img_src,
                    'player' => $card->player ? [
                        'id' => $card->player->id,
                        'name' => $card->player->name,
                        'fullname' => $card->player->fullname,
                        'position' => $card->player->position,
                        'img_src' => $card->player->img_src,
                        'country' => $card->player->country ? [
                            'id' => $card->player->country->id,
                            'name' => $card->player->country->name,
                            'code' => $card->player->country->code,
                        ] : null,
                    ] : null,
                    'event' => $card->event ? [
                        'id' => $card->event->id,
                        'name' => $card->event->name,
                        'slug' => $card->event->slug,
                        'theme_color' => $card->event->theme_color,
                    ] : null,
                ];
            })
            ->filter()
            ->values();

        return $this->successResponse($userCards, 'User player cards fetched successfully');
    }

    /**
     * Get user's powerups inventory.
     */
    public function myPowerups(Request $request): JsonResponse
    {
        $powerups = UserPowerup::query()
            ->where('user_id', $request->user()->id)
            ->with('powerup')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'powerup_id' => $item->powerup_id,
                    'quantity' => $item->quantity,
                    'powerup' => $item->powerup ? new PowerupResource($item->powerup) : null,
                ];
            });

        return $this->successResponse($powerups, 'User powerups fetched successfully');
    }

    /**
     * Get user's cosmetics locker.
     */
    public function myCosmetics(Request $request): JsonResponse
    {
        $cosmetics = UserCard::query()
            ->where('user_id', $request->user()->id)
            ->where('cardable_type', Cosmetic::class)
            ->with('cardable')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'cosmetic_id' => $item->cardable_id,
                    'quantity' => $item->quantity,
                    'cosmetic' => $item->cardable ? new CosmeticResource($item->cardable) : null,
                ];
            });

        return $this->successResponse($cosmetics, 'User cosmetics fetched successfully');
    }

    /**
     * Get user's active squad lineup.
     */
    public function getLineup(Request $request): JsonResponse
    {
        $setting = UserSetting::query()
            ->where('user_id', $request->user()->id)
            ->where('key', 'squad_lineup')
            ->first();

        $lineup = $setting ? json_decode($setting->value, true) : null;

        return $this->successResponse($lineup, 'Squad lineup fetched successfully');
    }

    /**
     * Save user's active squad lineup.
     */
    public function saveLineup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'formation' => ['required', 'string'],
            'slots' => ['required', 'array'],
        ]);

        $setting = UserSetting::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'key' => 'squad_lineup',
            ],
            [
                'value' => json_encode($validated),
            ]
        );

        return $this->successResponse(json_decode($setting->value, true), 'Squad lineup saved successfully');
    }
}
