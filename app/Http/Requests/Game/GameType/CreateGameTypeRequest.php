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
            'description' => 'nullable|string|max:1000',
        ];
    }
} 