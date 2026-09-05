<?php
namespace App\Http\Requests\Packs\Cosmetic;

use App\Enums\Packs\CardRarity;
use App\Http\Requests\Shared\BaseFilterRequest;
use Illuminate\Validation\Rules\Enum;

class CosmeticFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'type',
            'slug',
            'name',
            'rarity',
            'created_at',
        ];
    }

    protected function filterRules(): array
    {
        return [
            'type' => ['nullable', 'string', 'max:30'],
            'slug' => ['nullable', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:100'],
            'rarity' => ['nullable', new Enum(CardRarity::class)],
        ];
    }
}