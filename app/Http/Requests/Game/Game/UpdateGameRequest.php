<?php

namespace App\Http\Requests\Game\Game;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'title' => 'sometimes|nullable|string|max:1000',
            'game_type_id' => 'sometimes|integer|exists:game_types,id',
        ];
    }
} 