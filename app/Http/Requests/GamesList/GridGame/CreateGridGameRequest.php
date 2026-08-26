<?php

namespace App\Http\Requests\GamesList\GridGame;

use App\Enums\GameEngine\GameDifficulty;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateGridGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'size' => 'required|integer|min:3|max:5',
            'difficulty' => [
                'required',
                Rule::enum(GameDifficulty::class),
            ],
        ];
    }
}
