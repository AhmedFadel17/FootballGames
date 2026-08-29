<?php

namespace App\Services\GameEngine\ConditionPool;

use App\Enums\GameEngine\GameDifficulty;
use App\Models\Core\Player;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

interface IConditionPoolService
{
    public function generatePool(GameDifficulty $difficulty, int $size): Collection;
    public function generateGridPools(GameDifficulty $difficulty, int $size): array;
    public function validate(Player $player, Model $targetObject, string $objectType): bool;
}
