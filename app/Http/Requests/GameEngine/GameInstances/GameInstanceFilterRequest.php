<?php

namespace App\Http\Requests\GameEngine\GameInstances;

use App\Http\Requests\Shared\BaseFilterRequest;

class GameInstanceFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['game_id', 'start_at', 'end_at', 'status', 'created_at', 'updated_at'];
    }

    public function filterRules(): array
    {
        return [
            'game_id' => 'nullable|integer|exists:games,id',
            'status' => 'nullable|string|in:active,inactive,completed,cancelled',
        ];
    }

}