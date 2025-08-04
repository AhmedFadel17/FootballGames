<?php

namespace App\Http\Requests\Game\GameEntry;

use Illuminate\Foundation\Http\FormRequest;

class CreateGameEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'game_instance_id' => 'required|integer|exists:game_instances,id',
            'data' => 'nullable|string|max:1000',
        ];
    }
} 