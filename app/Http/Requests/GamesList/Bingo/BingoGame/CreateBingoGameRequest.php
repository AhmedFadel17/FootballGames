<?php

namespace App\Http\Requests\GamesList\Bingo\BingoGame;

use App\Shared\Enums\GameDifficulty;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'difficulty' => [
                'required',
                'string',
                Rule::in(array_column(GameDifficulty::cases(), 'value')),
            ],
        ];
    }
}
