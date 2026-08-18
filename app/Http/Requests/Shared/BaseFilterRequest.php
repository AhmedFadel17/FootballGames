<?php
namespace App\Http\Requests\Shared;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

abstract class BaseFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    abstract protected function filterRules(): array;
    protected function allowedSortFields(): array
    {
        return [];
    }

    public function rules(): array
    {
        $baseRules = [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'sort_order' => 'nullable|string|in:asc,desc,ASC,DESC',
        ];

        $allowedSorts = $this->allowedSortFields();
        if (!empty($allowedSorts)) {
            $baseRules['sort_by'] = ['nullable', 'string', Rule::in($allowedSorts)];
        } else {
            $baseRules['sort_by'] = 'nullable|string|max:255';
        }

        return array_merge($baseRules, $this->filterRules());
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'page' => $this->input('page', 1),
            'per_page' => $this->input('per_page', 10),
            'sort_order' => strtolower($this->input('sort_order', 'asc')),
        ]);
    }
}