<?php

namespace App\Http\Requests\Core\Season;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeasonRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'start_year' => ['sometimes', 'integer', 'min:1900', 'max:2100'],
            'end_year' => ['sometimes', 'integer', 'min:1900', 'max:2100', 'gte:start_year'],
        ];
    }
} 