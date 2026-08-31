<?php

namespace App\Models\GameEngine;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    protected $fillable = [
        'name',
        'min_players',
        'max_players',
        'slug',
        'description',
        'is_active',
        'img_src',
        'stamina_cost',
        'base_xp',
        'base_coins',
        'base_points',
        'time_limit_seconds'
    ];

    public function instances(): HasMany
    {
        return $this->hasMany(GameInstance::class);
    }
}