<?php

namespace App\Http\Requests\GamesList\GuessThePlayer;

use App\Shared\Enums\GameDifficulty;
use Illuminate\Foundation\Http\FormRequest;

class JoinGuessThePlayerGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|min:1|max:10,exists:game_instances,room_code',
        ];
    }
}
