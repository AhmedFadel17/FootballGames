<?php

namespace App\Http\Requests\Core\PlayerTeamPeriod;

use Illuminate\Foundation\Http\FormRequest;

class PlayerTeamPeriodFilterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'id' => 'nullable|integer',
            'player_id' => 'nullable|integer',
            'team_id' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'sort_by' => 'nullable|string|in:id,player_id,team_id,start_date,end_date',
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