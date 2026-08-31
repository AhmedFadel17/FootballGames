<?php

namespace App\Services\Infra\PlayerProgress;

use App\Models\User;

interface IPlayerProgressService
{
    public function refreshStamina(User $user): User;
    public function consumeStamina(User $user, int $amount = 10): bool;
    public function rewardPlayer(User $user, int $points, int $coins, int $xpGained): array;
}