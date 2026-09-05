<?php
namespace App\Http\Requests\Packs\PlayerCard;

use App\Enums\Packs\CardRarity;
use App\Http\Requests\Shared\BaseFilterRequest;
use Illuminate\Validation\Rules\Enum;

class PlayerCardFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'player_id',
            'event_id',
            'rarity',
            'rating',
            'is_packable',
            'created_at',
        ];
    }

    protected function filterRules(): array
    {
        return [
            'player_id' => ['nullable', 'exists:players,id'],
            'event_id' => ['nullable', 'exists:events,id'],
            'rarity' => ['nullable', new Enum(CardRarity::class)],
            'rating' => ['nullable', 'integer', 'min:1', 'max:99'],
            'is_packable' => ['nullable', 'boolean'],
        ];
    }
}