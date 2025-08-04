<?php

namespace App\Http\Requests\GamesList\Bingo\BingoGame;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBingoGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'game_instance_id' => 'sometimes|integer|exists:game_instances,id',
            'size' => 'sometimes|integer|min:1',
            'remaining_answers' => 'sometimes|integer|min:0',
        ];
    }
} 