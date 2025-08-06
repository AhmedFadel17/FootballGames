<?php

namespace App\Http\Requests\GamesList\Bingo\BingoGame;

use Illuminate\Foundation\Http\FormRequest;

class CreateBingoGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'game_id' => 'required|integer|exists:games,id',
            'size' => 'required|integer|min:1',
        ];
    }
} 