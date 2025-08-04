<?php

namespace App\Http\Requests\Game\GamePrize;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGamePrizeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'game_instance_id' => 'sometimes|integer|exists:game_instances,id',
            'rank' => 'sometimes|integer|min:1',
            'reward' => 'sometimes|string|max:255',
        ];
    }
} 