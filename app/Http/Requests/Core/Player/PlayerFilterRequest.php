<?php

namespace App\Http\Requests\Core\Player;

use App\Http\Requests\Shared\BaseFilterRequest;

class PlayerFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['id', 'name', 'position', 'date_of_birth', 'fullname', 'height_cm', 'weight_kg', 'country_id', 'popularity', 'created_at'];
    }

    protected function filterRules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'fullname' => ['nullable', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:50'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'date_of_birth' => ['nullable', 'date'],
            'height_cm' => ['nullable', 'integer', 'min:0', 'max:250'],
            'weight_kg' => ['nullable', 'integer', 'min:0', 'max:250'],
            'popularity' => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
