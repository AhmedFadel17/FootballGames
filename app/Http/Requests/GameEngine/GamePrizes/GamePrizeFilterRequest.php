<?php

namespace App\Http\Requests\GameEngine\GamePrizes;

use App\Http\Requests\Shared\BaseFilterRequest;

class GamePrizeFilterRequest extends BaseFilterRequest
{
    protected function allowedSortFields(): array
    {
        return ['game_instance_id', 'rank', 'reward', 'created_at', 'updated_at'];
    }

    public function filterRules(): array
    {
        return [
            'game_instance_id' => 'nullable|integer|exists:game_instances,id',
            'rank' => 'nullable|integer|min:1',
        ];
    }

}