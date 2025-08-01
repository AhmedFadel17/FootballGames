<?php

namespace App\Http\Requests\Core\Transfer;

use Illuminate\Foundation\Http\FormRequest;

class TransferFilterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'id' => 'nullable|integer',
            'player_id' => 'nullable|integer',
            'from_team_id' => 'nullable|integer',
            'to_team_id' => 'nullable|integer',
            'transfer_date' => 'nullable|date',
            'sort_by' => 'nullable|string|in:id,player_id,from_team_id,to_team_id,transfer_date',
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