<?php

namespace App\Http\Requests\Core\Team;

use Illuminate\Foundation\Http\FormRequest;

class TeamFilterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'id' => 'nullable|integer',
            'name' => 'nullable|string|max:255',
            'short_name' => 'nullable|string|max:100',
            'abbr' => 'nullable|string|max:10',
            'country_id' => 'nullable|integer',
            'api_id' => 'nullable|integer',
            'sort_by' => 'nullable|string|in:id,name,short_name,popularity,abbr,country_id,api_id',
            'sort_order' => 'nullable|string|in:asc,desc',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'page' => $this->input('page', 1),
            'per_page' => $this->input('per_page', 10),
            'sort_order' => $this->input('sort_order', 'asc'),
        ]);
    }
} 