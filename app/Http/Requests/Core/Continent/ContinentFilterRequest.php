<?php

namespace App\Http\Requests\Core\Continent;

use App\Http\Requests\Shared\BaseFilterRequest;
use Illuminate\Foundation\Http\FormRequest;

class ContinentFilterRequest extends BaseFilterRequest
{

    protected function allowedSortFields(): array
    {
        return ['id', 'name', 'code', 'popularity', 'created_at'];
    }

    protected function filterRules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:10'],
            'popularity' => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}