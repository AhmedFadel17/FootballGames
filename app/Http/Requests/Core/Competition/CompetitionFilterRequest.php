<?php

namespace App\Http\Requests\Core\Competition;

use Illuminate\Foundation\Http\FormRequest;

class CompetitionFilterRequest extends FormRequest
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
            'country_id' => 'nullable|integer',
            'type' => 'nullable|string|max:50',
            'tier' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'sort_by' => 'nullable|string|in:id,name,short_name,country_id,type,tier,is_active',
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