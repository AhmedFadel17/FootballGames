<?php

namespace App\Http\Requests\Core\CompetitionTeamFullStat;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompetitionTeamFullStatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'competition_id' => ['sometimes', 'exists:competitions,id'],
            'team_id' => ['sometimes', 'exists:teams,id'],
            'matches_played' => ['nullable', 'integer', 'min:0'],
            'wins' => ['nullable', 'integer', 'min:0'],
            'draws' => ['nullable', 'integer', 'min:0'],
            'losses' => ['nullable', 'integer', 'min:0'],
            'goals_for' => ['nullable', 'integer', 'min:0'],
            'goals_against' => ['nullable', 'integer', 'min:0'],
            'clean_sheets' => ['nullable', 'integer', 'min:0'],
            'yellow_cards' => ['nullable', 'integer', 'min:0'],
            'red_cards' => ['nullable', 'integer', 'min:0'],
            'penalties_scored' => ['nullable', 'integer', 'min:0'],
        ];
    }
} 