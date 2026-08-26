<?php

namespace App\Http\Requests\Core\Continent;

use Illuminate\Foundation\Http\FormRequest;

class CreateContinentRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:3'],
            'img_src' => ['required', 'string', 'max:500'],
            'popularity' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }
}