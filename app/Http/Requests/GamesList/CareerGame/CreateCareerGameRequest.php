<?php

namespace App\Http\Requests\GamesList\CareerGame;

use App\Enums\GameEngine\GameDifficulty;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCareerGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'difficulty' => [
                'required',
                Rule::enum(GameDifficulty::class),
            ],
        ];
    }
}
