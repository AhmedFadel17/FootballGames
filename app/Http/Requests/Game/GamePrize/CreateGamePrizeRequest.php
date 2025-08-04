<?php

namespace App\Http\Requests\Game\GamePrize;

use Illuminate\Foundation\Http\FormRequest;

class CreateGamePrizeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'game_instance_id' => 'required|integer|exists:game_instances,id',
            'rank' => 'required|integer|min:1',
            'reward' => 'required|string|max:255',
        ];
    }
} 