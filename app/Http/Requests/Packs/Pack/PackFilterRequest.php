<?php
namespace App\Http\Requests\Packs\Pack;

use App\Enums\Packs\PackLimitType;
use App\Http\Requests\Shared\BaseFilterRequest;
use Illuminate\Validation\Rule;

class PackFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'slug',
            'name',
            'price_coins',
            'cards_count',
            'required_level',
            'is_active',
            'created_at',
        ];
    }

    protected function filterRules(): array
    {
        return [
            'slug' => ['nullable', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:100'],
            'price_coins' => ['nullable', 'integer', 'min:0'],
            'cards_count' => ['nullable', 'integer', 'min:1'],
            'required_level' => ['nullable', 'integer', 'min:1'],
            'limit_type' => ['nullable', Rule::enum(PackLimitType::class)],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}