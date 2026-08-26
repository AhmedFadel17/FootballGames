<?php

namespace App\Http\Requests\Core\Manager;

use Illuminate\Foundation\Http\FormRequest;

class UpdateManagerRequest extends FormRequest
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
            'slug' => ['sometimes', 'string', 'max:255'],
            'api_id' => ['sometimes', 'integer'],
            'img_src' => ['nullable', 'string', 'max:255'],
            'country_id' => ['sometimes', 'exists:countries,id'],
            'popularity' => ['sometimes', 'integer'],
            'is_retired' => ['sometimes', 'boolean'],
            'current_team_id' => ['sometimes', 'nullable', 'exists:teams,id'],
        ];
    }
}