<?php

namespace App\Http\Requests\Core\CompetitionTeamFullStat;

use Illuminate\Foundation\Http\FormRequest;

class CompetitionTeamFullStatFilterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'id' => 'nullable|integer',
            'competition_id' => 'nullable|integer',
            'team_id' => 'nullable|integer',
            'matches_played' => 'nullable|integer',
            'wins' => 'nullable|integer',
            'draws' => 'nullable|integer',
            'losses' => 'nullable|integer',
            'goals_for' => 'nullable|integer',
            'goals_against' => 'nullable|integer',
            'clean_sheets' => 'nullable|integer',
            'yellow_cards' => 'nullable|integer',
            'red_cards' => 'nullable|integer',
            'penalties_scored' => 'nullable|integer',
            'sort_by' => 'nullable|string|in:id,competition_id,team_id,matches_played,wins,draws,losses,goals_for,goals_against',
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