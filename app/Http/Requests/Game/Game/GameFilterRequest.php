<?php

namespace App\Http\Requests\Game\Game;

use Illuminate\Foundation\Http\FormRequest;

class GameFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'slug' => 'nullable|string|exists:games,slug',
        ];
    }
} 