<?php

namespace App\Http\Requests\Game\Game;

use Illuminate\Foundation\Http\FormRequest;

class CreateGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:games,name',
            'description' => 'required|string|max:1000',
            'slug' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'alpha_dash',
                'unique:games,slug',
            ],
            'min_players' => 'required|integer|min:1|max:100',
            'max_players' => [
                'required',
                'integer',
                'max:100',
                'gte:min_players',
            ],
            'default_config' => 'nullable|array',
        ];
    }
}
