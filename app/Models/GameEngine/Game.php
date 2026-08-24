<?php

namespace App\Models\GameEngine;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    protected $fillable = ['name', 'min_players', 'max_players', 'slug', 'description', 'is_active'];

    public function instances(): HasMany
    {
        return $this->hasMany(GameInstance::class);
    }
}