<?php

namespace App\Http\Requests\Core\Player;

use Illuminate\Foundation\Http\FormRequest;

class CreatePlayerRequest extends FormRequest
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
            'name'       => ['required', 'string', 'max:255'],
            'fullname' => ['required', 'string', 'max:455'],
            'position'   => ['required', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date'],
            'country_id' => ['nullable', 'exists:countries,id'],
            'popularity' => ['nullable', 'integer', 'min:0', 'max:100'],
            'api_id' => ['nullable', 'integer'],
            'img_src' => ['nullable', 'string', 'max:500'],
        ];
    }
}
