<?php

namespace App\Http\Requests\Core\Season;

use App\Http\Requests\Shared\BaseFilterRequest;

class SeasonFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['id', 'name', 'start_year', 'end_year', 'created_at'];
    }

    protected function filterRules(): array
    {
        return [
            'id' => 'nullable|integer',
            'name' => 'nullable|string|max:255',
            'start_year' => 'nullable|integer',
            'end_year' => 'nullable|integer',
        ];
    }
}