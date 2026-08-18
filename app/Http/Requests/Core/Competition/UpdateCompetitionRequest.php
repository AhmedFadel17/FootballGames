<?php

namespace App\Http\Requests\Core\Competition;

use App\Enums\Core\CompetitionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompetitionRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'abbr' => ['sometimes', 'string', 'max:100'],
            'country_id' => ['sometimes', 'exists:countries,id'],
            'type' => ['sometimes', Rule::enum(CompetitionType::class)],
            'founded_year' => ['sometimes', 'integer', 'min:1800', 'max:2100'],
            'tier' => ['sometimes', 'integer', 'min:1', 'max:10'],
            'popularity' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'img_src' => ['sometimes', 'string', 'max:500'],
            'api_id' => ['sometimes', 'integer', 'min:0', 'max:2000000'],
            'slug' => ['sometimes', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}