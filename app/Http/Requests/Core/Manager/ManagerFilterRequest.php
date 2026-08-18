<?php

namespace App\Http\Requests\Core\Manager;

use App\Http\Requests\Shared\BaseFilterRequest;

class ManagerFilterRequest extends BaseFilterRequest
{

    protected function allowedSortFields(): array
    {
        return ['id', 'name', 'popularity', 'created_at'];
    }

    protected function filterRules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'popularity' => ['nullable', 'integer', 'min:0', 'max:100'],
            'country_id' => ['nullable', 'exists:countries,id'],
        ];
    }
}