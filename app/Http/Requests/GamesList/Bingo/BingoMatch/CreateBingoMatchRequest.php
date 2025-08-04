<?php

namespace App\Http\Requests\GamesList\Bingo\BingoMatch;

use Illuminate\Foundation\Http\FormRequest;

class CreateBingoMatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'bingo_game_id' => 'required|integer|exists:bingo_games,id',
            'player_id' => 'required|integer|exists:players,id',
            'pos' => 'required|integer|min:0',
        ];
    }
} 