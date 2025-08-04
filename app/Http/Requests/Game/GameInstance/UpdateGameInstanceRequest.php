<?php

namespace App\Http\Requests\Game\GameInstance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGameInstanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'game_id' => 'sometimes|integer|exists:games,id',
            'start_at' => 'sometimes|date',
            'end_at' => 'sometimes|nullable|date|after:start_at',
            'status' => 'sometimes|string|in:active,inactive,completed,cancelled',
        ];
    }
} 