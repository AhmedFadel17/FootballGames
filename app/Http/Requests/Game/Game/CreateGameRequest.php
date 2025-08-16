<?php

namespace App\Http\Requests\Game\Game;

use Illuminate\Foundation\Http\FormRequest;

class CreateGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'game_type_id' => 'required|integer|exists:game_types,id',
        ];
    }
} 

