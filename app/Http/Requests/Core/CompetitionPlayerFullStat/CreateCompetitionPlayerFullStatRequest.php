<?php

namespace App\Http\Requests\Core\CompetitionPlayerFullStat;

use Illuminate\Foundation\Http\FormRequest;

class CreateCompetitionPlayerFullStatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'competition_id' => ['required', 'exists:competitions,id'],
            'player_id' => ['required', 'exists:players,id'],
            'appearances' => ['nullable', 'integer', 'min:0'],
            'minutes_played' => ['nullable', 'integer', 'min:0'],
            'goals' => ['nullable', 'integer', 'min:0'],
            'assists' => ['nullable', 'integer', 'min:0'],
            'yellow_cards' => ['nullable', 'integer', 'min:0'],
            'red_cards' => ['nullable', 'integer', 'min:0'],
            'clean_sheets' => ['nullable', 'integer', 'min:0'],
            'saves' => ['nullable', 'integer', 'min:0'],
            'penalties_saved' => ['nullable', 'integer', 'min:0'],
            'own_goals' => ['nullable', 'integer', 'min:0'],
            'goals_conceded' => ['nullable', 'integer', 'min:0'],
        ];
    }
} 