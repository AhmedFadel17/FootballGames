<?php

namespace App\Http\Requests\GamesList\Bingo\BingoMatch;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBingoMatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'bingo_game_id' => 'sometimes|integer|exists:bingo_games,id',
            'player_id' => 'sometimes|integer|exists:players,id',
            'pos' => 'sometimes|integer|min:0',
        ];
    }
} 