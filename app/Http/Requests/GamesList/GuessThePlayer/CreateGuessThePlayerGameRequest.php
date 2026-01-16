<?php

namespace App\Http\Requests\GamesList\GuessThePlayer;

use App\Shared\Enums\GameDifficulty;
use Illuminate\Foundation\Http\FormRequest;

class CreateGuessThePlayerGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'players_count' => 'required|integer|min:2|max:4',
        ];
    }
}
