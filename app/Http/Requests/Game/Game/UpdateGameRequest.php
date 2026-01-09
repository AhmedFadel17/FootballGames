<?php

namespace App\Http\Requests\Game\Game;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $gameId = $this->route('game')?->id ?? $this->route('game');

        return [
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'slug' => [
                'sometimes',
                'string',
                'min:3',
                'max:50',
                'alpha_dash',
                "unique:games,slug,{$gameId}",
            ],
            'min_players' => 'sometimes|integer|min:1|max:100',
            'max_players' => [
                'sometimes',
                'integer',
                'min:1',
                'max:100',
                'gte:min_players',
            ],
            'is_active' => 'sometimes|boolean'
        ];
    }
}
