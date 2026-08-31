<?php

namespace App\Http\Requests\GamesList\TopList;

use App\Enums\GameEngine\GameDifficulty;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTopListGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'difficulty' => [
                'sometimes',
                Rule::enum(GameDifficulty::class),
            ],
        ];
    }

}
