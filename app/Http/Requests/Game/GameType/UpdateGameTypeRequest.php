<?php

namespace App\Http\Requests\Game\GameType;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGameTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'slug' => [
                'sometimes',
                'string',
                'min:3',
                'max:10',
                'regex:/^[a-zA-Z0-9-]+$/',
            ],
            'description' => 'sometimes|nullable|string|max:1000',
        ];
    }
} 