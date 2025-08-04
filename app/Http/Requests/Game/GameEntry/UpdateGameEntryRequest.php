<?php

namespace App\Http\Requests\Game\GameEntry;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGameEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'sometimes|integer|exists:users,id',
            'game_instance_id' => 'sometimes|integer|exists:game_instances,id',
            'data' => 'sometimes|nullable|string|max:1000',
        ];
    }
} 