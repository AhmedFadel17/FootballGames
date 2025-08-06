<?php

namespace App\Http\Requests\GamesList\Bingo\BingoCondition;

use Illuminate\Foundation\Http\FormRequest;

class BingoConditionFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bingo_game_id' => 'nullable|integer|exists:bingo_games,id',
        ];
    }

    
} 