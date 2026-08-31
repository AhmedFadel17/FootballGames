<?php

namespace App\Services\Infra\PlayerProgress;

use App\Models\User;
use App\Models\Infra\Level;
use Illuminate\Support\Facades\DB;

class PlayerProgressService implements IPlayerProgressService
{
    private const STAMINA_REGEN_MINUTES = 5;
    public function refreshStamina(User $user): User
    {

        if ($user->stamina >= $user->max_stamina) {
            $user->last_stamina_update = now();
            $user->save();
            return $user;
        }

        $lastUpdate = $user->last_stamina_update ?? now();
        $minutesPassed = floor(now()->diffInMinutes($lastUpdate));

        if ($minutesPassed >= self::STAMINA_REGEN_MINUTES) {
            $staminaToEarn = floor($minutesPassed / self::STAMINA_REGEN_MINUTES);
            $newStamina = min($user->max_stamina, $user->stamina + $staminaToEarn);

            $remainderMinutes = $minutesPassed % self::STAMINA_REGEN_MINUTES;

            $user->stamina = $newStamina;
            $user->last_stamina_update = now()->subMinutes($remainderMinutes);
            $user->save();
        }

        return $user;
    }

    public function consumeStamina(User $user, int $amount = 10): bool
    {
        $this->refreshStamina($user);

        if ($user->stamina < $amount) {
            return false;
        }

        $user->decrement('stamina', $amount);
        return true;
    }

    public function rewardPlayer(User $user, int $points, int $coins, int $xpGained): array
    {
        return DB::transaction(function () use ($user, $points, $coins, $xpGained) {
            $user->increment('points', $points);
            $user->increment('coins', $coins);
            $user->increment('xp', $xpGained);

            $leveledUp = $this->checkLevelUp($user);

            return [
                'points_gained' => $points,
                'coins_gained' => $coins,
                'xp_gained' => $xpGained,
                'leveled_up' => $leveledUp['has_leveled_up'],
                'new_level' => $user->level,
                'bonus_coins' => $leveledUp['bonus_coins'],
            ];
        });
    }

    private function checkLevelUp(User $user): array
    {
        $hasLeveledUp = false;
        $totalBonusCoins = 0;

        $nextLevels = Level::where('level', '>', $user->level)
            ->where('required_xp', '<=', $user->xp)
            ->orderBy('level', 'asc')
            ->get();

        foreach ($nextLevels as $level) {
            $user->level = $level->level;
            $totalBonusCoins += $level->coin_reward;
            $hasLeveledUp = true;
        }

        if ($hasLeveledUp) {
            if ($totalBonusCoins > 0) {
                $user->coins += $totalBonusCoins;
            }
            $user->stamina = $user->max_stamina;
            $user->save();
        }

        return [
            'has_leveled_up' => $hasLeveledUp,
            'bonus_coins' => $totalBonusCoins,
        ];
    }
}