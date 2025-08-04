<?php

namespace App\Http\Requests\GamesList\Bingo\BingoCondition;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBingoConditionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            'bingo_game_id' => 'sometimes|integer|exists:bingo_games,id',
            'object_id' => 'sometimes|integer',
            'object_type' => 'sometimes|string|max:255',
            'connection_type' => 'sometimes|string|in:horizontal,vertical,diagonal',
            'bingo_match_id' => 'sometimes|nullable|integer|exists:bingo_matches,id',
            'is_marked' => 'sometimes|boolean',
            'pos' => 'sometimes|integer|min:0',
        ];
    }
} 