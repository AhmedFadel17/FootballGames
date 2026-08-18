<?php

namespace App\Http\Requests\Core\Competition;

use App\Http\Requests\Shared\BaseFilterRequest;

class CompetitionFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['id', 'name', 'short_name', 'country_id', 'type', 'tier', 'is_active', 'popularity', 'created_at'];
    }

    protected function filterRules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'short_name' => 'nullable|string|max:100',
            'country_id' => ['nullable', 'exists:countries,id'],
            'type' => 'nullable|string|max:50',
            'tier' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ];
    }

}