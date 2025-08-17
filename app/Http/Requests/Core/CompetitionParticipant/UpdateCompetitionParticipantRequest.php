<?php

namespace App\Http\Requests\Core\CompetitionParticipant;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompetitionParticipantRequest extends FormRequest
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
            'season_id' => ['sometimes', 'exists:seasons,id'],
            'team_id' => ['sometimes', 'exists:teams,id'],
            'is_winner' => ['boolean'],
        ];
    }
} 