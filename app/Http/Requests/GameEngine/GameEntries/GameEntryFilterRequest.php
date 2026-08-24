<?php

namespace App\Http\Requests\GameEngine\GameEntries;

use App\Http\Requests\Shared\BaseFilterRequest;
use App\Enums\GameEngine\GameStatus;
use Illuminate\Validation\Rule;
class GameEntryFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['user_id', 'game_instance_id', 'status', 'created_at', 'updated_at'];
    }

    protected function filterRules(): array
    {
        return [
            'user_id' => 'nullable|integer|exists:users,id',
            'game_instance_id' => 'nullable|integer|exists:game_instances,id',
            'status' => ['nullable', 'string', Rule::enum(GameStatus::class)],
        ];
    }


}