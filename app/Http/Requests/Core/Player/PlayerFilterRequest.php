<?php

namespace App\Http\Requests\Core\Player;

use Illuminate\Foundation\Http\FormRequest;

class PlayerFilterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'page'         => 'nullable|integer|min:1',
            'per_page'     => 'nullable|integer|min:1|max:100',
            'search'       => 'nullable|string|max:255',
            'id'           => 'nullable|integer',
            'name'         => 'nullable|string|max:255',
            'position'     => 'nullable|string|max:50',
            'country_id'   => 'nullable|integer',
            'date_of_birth'=> 'nullable|date',
            'sort_by'      => 'nullable|string|in:id,name,position,fullname,date_of_birth,country_id,popularity',
            'sort_order'   => 'nullable|string|in:asc,desc',
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
