<?php

namespace App\Http\Requests\GamesList\Bingo\BingoCondition;

use Illuminate\Foundation\Http\FormRequest;

class CreateBingoConditionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'bingo_game_id' => 'required|integer|exists:bingo_games,id',
            'object_id' => 'required|integer',
            'object_type' => 'required|string|max:255',
            'connection_type' => 'required|string|in:horizontal,vertical,diagonal',
            'bingo_match_id' => 'nullable|integer|exists:bingo_matches,id',
            'is_marked' => 'required|boolean',
            'pos' => 'required|integer|min:0',
        ];
    }
} 