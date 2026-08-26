<?php

namespace App\Http\Requests\Core\Team;

use App\Enums\Core\TeamType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateTeamRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'abbr' => ['required', 'string', 'max:10'],
            'img_src' => ['required', 'string', 'max:500'],
            'api_id' => ['nullable', 'integer'],
            'slug' => ['required', 'string', 'max:255'],
            'popularity' => ['required', 'integer', 'min:0', 'max:100'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'type' => ['required', Rule::enum(TeamType::class)],
            'current_competition_id' => ['nullable', 'exists:competitions,id'],
        ];
    }
}