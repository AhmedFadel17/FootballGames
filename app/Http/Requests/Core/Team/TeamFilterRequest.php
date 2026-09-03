<?php

namespace App\Http\Requests\Core\Team;

use App\Http\Requests\Shared\BaseFilterRequest;

class TeamFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return [
            'id',
            'name',
            'slug',
            'popularity',
            'abbr',
            'country_id',
            'current_competition_id',
            'api_id',
            'created_at'
        ];
    }

    protected function filterRules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'abbr' => 'nullable|string|max:10',
            'country_id' => 'nullable|integer',
            'current_competition_id' => 'nullable|integer',
            'api_id' => 'nullable|integer',
            'popularity' => 'nullable|integer',
        ];
    }
}