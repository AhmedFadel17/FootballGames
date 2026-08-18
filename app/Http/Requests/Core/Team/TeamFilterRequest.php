<?php

namespace App\Http\Requests\Core\Team;

use App\Http\Requests\Shared\BaseFilterRequest;

class TeamFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['id', 'name', 'short_name', 'popularity', 'abbr', 'country_id', 'api_id', 'created_at'];
    }

    protected function filterRules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'short_name' => 'nullable|string|max:100',
            'abbr' => 'nullable|string|max:10',
            'country_id' => 'nullable|integer',
            'api_id' => 'nullable|integer',
        ];
    }
}