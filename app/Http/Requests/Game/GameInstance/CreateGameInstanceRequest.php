<?php

namespace App\Http\Requests\Game\GameInstance;

use Illuminate\Foundation\Http\FormRequest;

class CreateGameInstanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'game_id' => 'required|integer|exists:games,id',
            'start_at' => 'required|date',
            'end_at' => 'nullable|date|after:start_at',
            'status' => 'required|string|in:active,inactive,completed,cancelled',
        ];
    }
} 