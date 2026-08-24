<?php

namespace App\Http\Requests\GameEngine\Games;

use App\Http\Requests\Shared\BaseFilterRequest;


class GameFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['id', 'name', 'slug', 'description', 'is_active', 'created_at'];
    }

    protected function filterRules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ];
    }
}