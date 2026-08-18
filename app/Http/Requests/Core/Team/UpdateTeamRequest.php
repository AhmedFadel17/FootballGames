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
            'abbr' => ['sometimes', 'string', 'max:10'],
            'img_src' => ['sometimes', 'string', 'max:500'],
            'api_id' => ['sometimes', 'integer'],
            'slug' => ['sometimes', 'string', 'max:255'],
            'country_id' => ['sometimes', 'exists:countries,id'],
            'popularity' => ['sometimes', 'integer', 'min:0', 'max:100'],
        ];
    }
}