<?php

namespace App\Http\Requests\Core\Competition;

use Illuminate\Foundation\Http\FormRequest;

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
            'short_name' => ['nullable', 'string', 'max:100'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'type' => ['nullable', 'string', 'max:50'],
            'founded_year' => ['nullable', 'integer', 'min:1800', 'max:2100'],
            'tier' => ['nullable', 'integer', 'min:1', 'max:10'],
            'popularity' => ['nullable', 'integer', 'min:0', 'max:100'],
            'img_src' => ['nullable', 'string', 'max:500'],
            'is_active' => ['boolean'],
        ];
    }
} 