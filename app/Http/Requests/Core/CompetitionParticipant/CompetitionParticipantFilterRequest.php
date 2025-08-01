<?php

namespace App\Http\Requests\Core\CompetitionParticipant;

use Illuminate\Foundation\Http\FormRequest;

class CompetitionParticipantFilterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'id' => 'nullable|integer',
            'competition_id' => 'nullable|integer',
            'season_id' => 'nullable|integer',
            'team_id' => 'nullable|integer',
            'is_winner' => 'nullable|boolean',
            'sort_by' => 'nullable|string|in:id,competition_id,season_id,team_id,is_winner',
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