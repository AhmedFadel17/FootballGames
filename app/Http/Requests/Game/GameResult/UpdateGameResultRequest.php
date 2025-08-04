<?php

namespace App\Http\Requests\Game\GameResult;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGameResultRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'game_instance_id' => 'sometimes|integer|exists:game_instances,id',
            'user_id' => 'sometimes|integer|exists:users,id',
            'score' => 'sometimes|integer|min:0',
            'rank' => 'sometimes|integer|min:1',
        ];
    }
} 