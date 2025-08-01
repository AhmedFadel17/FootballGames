<?php

namespace App\Http\Requests\Core\Country;

use Illuminate\Foundation\Http\FormRequest;

class CountryFilterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'id' => 'nullable|integer',
            'name' => 'nullable|string|max:255',
            'code' => 'nullable|string|max:10',
            'continent_id' => 'nullable|integer',
            'sort_by' => 'nullable|string|in:id,name,code,continent_id',
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