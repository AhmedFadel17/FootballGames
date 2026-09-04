<?php

namespace App\Http\Requests\Core\Manager;

use App\Http\Requests\Shared\BaseFilterRequest;

class ManagerFilterRequest extends BaseFilterRequest
{

    protected function allowedSortFields(): array
    {
        return [
            'id',
            'name',
            'popularity',
            'current_team_id',
            'country_id',
            'slug',
            'api_id',
            'created_at'
        ];
    }

    protected function filterRules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'popularity' => ['nullable', 'integer', 'min:0', 'max:100'],
            'current_team_id' => ['nullable', 'exists:teams,id'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'slug' => ['nullable', 'string', 'max:255'],
            'is_retired' => ['nullable', 'boolean'],
            'api_id' => ['nullable', 'integer'],
        ];
    }
}