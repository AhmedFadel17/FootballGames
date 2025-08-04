<?php

namespace App\Http\Requests\Game\GameResult;

use Illuminate\Foundation\Http\FormRequest;

class CreateGameResultRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'game_instance_id' => 'required|integer|exists:game_instances,id',
            'user_id' => 'required|integer|exists:users,id',
            'score' => 'required|integer|min:0',
            'rank' => 'required|integer|min:1',
        ];
    }
} 