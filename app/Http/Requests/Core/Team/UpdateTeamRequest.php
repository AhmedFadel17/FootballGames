<?php

namespace App\Http\Requests\Core\Team;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamRequest extends FormRequest
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
            'abbr' => ['nullable', 'string', 'max:10'],
            'img_src' => ['nullable', 'string', 'max:500'],
            'api_id' => ['nullable', 'integer'],
            'country_id' => ['nullable', 'exists:countries,id'],
        ];
    }
} 