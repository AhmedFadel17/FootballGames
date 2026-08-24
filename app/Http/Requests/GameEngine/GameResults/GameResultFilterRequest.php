<?php

namespace App\Http\Requests\GameEngine\GameResults;

use App\Http\Requests\Shared\BaseFilterRequest;

class GameResultFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['game_instance_id', 'user_id', 'score', 'rank', 'created_at', 'updated_at'];
    }

    protected function filterRules(): array
    {
        return [
            'game_instance_id' => 'nullable|integer|exists:game_instances,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'score' => 'nullable|integer',
            'rank' => 'nullable|integer',
        ];
    }

}