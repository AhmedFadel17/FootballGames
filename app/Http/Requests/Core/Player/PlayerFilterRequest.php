<?php

namespace App\Http\Requests\Core\Player;

use App\Http\Requests\Shared\BaseFilterRequest;

class PlayerFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'name',
            'position',
            'sub_position',
            'date_of_birth',
            'fullname',
            'height_cm',
            'weight_kg',
            'market_value',
            'rating',
            'country_id',
            'current_team_id',
            'popularity',
            'created_at'
        ];
    }

    protected function filterRules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'fullname' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'integer', 'max:50'],
            'sub_position' => ['nullable', 'integer', 'max:50'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'current_team_id' => ['nullable', 'exists:teams,id'],
            'date_of_birth' => ['nullable', 'date'],
            'height_cm' => ['nullable', 'integer', 'min:0', 'max:250'],
            'weight_kg' => ['nullable', 'integer', 'min:0', 'max:250'],
            'market_value' => ['nullable', 'integer', 'min:0'],
            'rating' => ['nullable', 'integer', 'min:0', 'max:100'],
            'popularity' => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
