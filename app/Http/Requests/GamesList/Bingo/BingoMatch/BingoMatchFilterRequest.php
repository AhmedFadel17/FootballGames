<?php

namespace App\Http\Requests\GamesList\Bingo\BingoMatch;

use Illuminate\Foundation\Http\FormRequest;

class BingoMatchFilterRequest extends FormRequest
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