<?php

namespace App\Http\Requests\Core\CompetitionSeason;

use Illuminate\Foundation\Http\FormRequest;

class CreateCompetitionSeasonRequest extends FormRequest
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
            'season_id' => ['required', 'exists:seasons,id'],
            'competition_id' => ['required', 'exists:competitions,id'],
            'winner_team_id' => ['nullable', 'exists:teams,id'],
        ];
    }
}