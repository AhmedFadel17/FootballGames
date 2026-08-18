<?php

namespace App\Http\Requests\Core\Competition;

use App\Enums\Core\CompetitionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCompetitionRequest extends FormRequest
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
            'abbr' => ['required', 'string', 'max:100'],
            'country_id' => ['required', 'exists:countries,id'],
            'type' => ['required', Rule::enum(CompetitionType::class)],
            'founded_year' => ['required', 'integer', 'min:1800', 'max:2100'],
            'tier' => ['required', 'integer', 'min:1', 'max:10'],
            'img_src' => ['required', 'string', 'max:500'],
            'popularity' => ['required', 'integer', 'min:0', 'max:100'],
            'api_id' => ['nullable', 'integer', 'min:0', 'max:2000000'],
            'slug' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}