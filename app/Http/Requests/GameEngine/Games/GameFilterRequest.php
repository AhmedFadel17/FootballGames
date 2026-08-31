<?php

namespace App\Http\Requests\GameEngine\Games;

use App\Http\Requests\Shared\BaseFilterRequest;


class GameFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'name',
            'slug',
            'description',
            'is_active',
            'created_at',
            'stamina_cost',
            'base_xp',
            'base_coins',
            'base_points',
            'time_limit_seconds'
        ];
    }

    protected function filterRules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'stamina_cost' => 'nullable|integer|min:0',
            'base_xp' => 'nullable|integer|min:0',
            'base_coins' => 'nullable|integer|min:0',
            'base_points' => 'nullable|integer|min:0',
            'time_limit_seconds' => 'nullable|integer|min:1|max:3600',
        ];
    }
}