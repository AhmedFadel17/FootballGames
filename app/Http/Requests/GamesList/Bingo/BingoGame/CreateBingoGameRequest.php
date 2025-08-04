<?php

namespace App\Http\Requests\GamesList\Bingo\BingoGame;

use Illuminate\Foundation\Http\FormRequest;

class CreateBingoGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'game_instance_id' => 'required|integer|exists:game_instances,id',
            'size' => 'required|integer|min:1',
            'remaining_answers' => 'required|integer|min:0',
        ];
    }
} 