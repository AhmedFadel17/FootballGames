<?php

namespace App\Http\Requests\Packs\Powerup;

use App\Enums\Packs\CardRarity;
use App\Enums\Packs\PowerupType;
use App\Http\Requests\Shared\BaseFilterRequest;
use Illuminate\Validation\Rule;

class PowerupFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'slug',
            'name',
            'type',
            'rarity',
            'created_at',
        ];
    }

    protected function filterRules(): array
    {
        return [
            'slug' => ['nullable', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', Rule::enum(PowerupType::class)],
            'rarity' => ['nullable', Rule::enum(CardRarity::class)],
        ];
    }
}