<?php

namespace App\Http\Requests\Core\Country;

use App\Http\Requests\Shared\BaseFilterRequest;
use Illuminate\Foundation\Http\FormRequest;

class CountryFilterRequest extends BaseFilterRequest
{

    protected function allowedSortFields(): array
    {
        return ['id', 'name', 'code', 'popularity', 'continent_id', 'created_at'];
    }

    protected function filterRules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:10'],
            'popularity' => ['nullable', 'integer', 'min:0', 'max:100'],
            'continent_id' => ['nullable', 'exists:continents,id'],
        ];
    }
}