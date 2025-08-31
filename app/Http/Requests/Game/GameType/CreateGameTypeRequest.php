<?php

namespace App\Http\Requests\Game\GameType;

use Illuminate\Foundation\Http\FormRequest;

class CreateGameTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => [
                'required',
                'string',
                'min:3',
                'max:10',
                'regex:/^[a-zA-Z0-9-]+$/',
            ],
            'description' => 'nullable|string|max:1000',
        ];
    }
}
