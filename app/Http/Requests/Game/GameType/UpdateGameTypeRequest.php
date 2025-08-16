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
            'description' => 'sometimes|nullable|string|max:1000',
        ];
    }
} 