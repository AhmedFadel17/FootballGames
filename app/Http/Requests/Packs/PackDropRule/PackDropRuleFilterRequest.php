<?php

namespace App\Http\Requests\Packs\PackDropRule;

use App\Enums\Packs\CardRarity;
use App\Http\Requests\Shared\BaseFilterRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class PackDropRuleFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'pack_id',
            'drop_type',
            'rarity',
            'event_id',
            'drop_percentage',
            'created_at',
        ];
    }

    protected function filterRules(): array
    {
        return [
            'pack_id' => ['nullable', 'exists:packs,id'],
            'drop_type' => ['nullable', Rule::in(['player_card', 'team', 'powerup', 'cosmetic', 'coins'])],
            'rarity' => ['nullable', new Enum(CardRarity::class)],
            'event_id' => ['nullable', 'exists:events,id'],
            'drop_percentage' => ['nullable', 'numeric', 'min:0.01', 'max:100'],
        ];
    }
}