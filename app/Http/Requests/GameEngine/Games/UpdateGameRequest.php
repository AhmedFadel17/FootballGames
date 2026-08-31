<?php

namespace App\Http\Requests\GameEngine\Games;

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
            'img_src' => 'sometimes|nullable|string|max:500',
            'is_active' => 'sometimes|boolean',
            'stamina_cost' => 'sometimes|nullable|integer|min:0',
            'base_xp' => 'sometimes|nullable|integer|min:0',
            'base_coins' => 'sometimes|nullable|integer|min:0',
            'base_points' => 'sometimes|nullable|integer|min:0',
            'time_limit_seconds' => 'sometimes|nullable|integer|min:1|max:3600',
        ];
    }
}
