<?php

namespace App\Http\Requests\Core\CompetitionPlayerFullStat;

use Illuminate\Foundation\Http\FormRequest;

class CompetitionPlayerFullStatFilterRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
            'id' => 'nullable|integer',
            'competition_id' => 'nullable|integer',
            'player_id' => 'nullable|integer',
            'appearances' => 'nullable|integer',
            'minutes_played' => 'nullable|integer',
            'goals' => 'nullable|integer',
            'assists' => 'nullable|integer',
            'yellow_cards' => 'nullable|integer',
            'red_cards' => 'nullable|integer',
            'clean_sheets' => 'nullable|integer',
            'saves' => 'nullable|integer',
            'penalties_saved' => 'nullable|integer',
            'own_goals' => 'nullable|integer',
            'goals_conceded' => 'nullable|integer',
            'sort_by' => 'nullable|string|in:id,competition_id,player_id,appearances,minutes_played,goals,assists,yellow_cards,red_cards,clean_sheets,saves,penalties_saved,own_goals,goals_conceded',
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