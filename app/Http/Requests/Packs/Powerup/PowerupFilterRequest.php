<?php

namespace App\Http\Requests\Packs\Powerup;

use App\Http\Requests\Shared\BaseFilterRequest;

class PowerupFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'slug',
            'name',
            'created_at',
        ];
    }

    protected function filterRules(): array
    {
        return [
            'slug' => ['nullable', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:100'],
        ];
    }
}