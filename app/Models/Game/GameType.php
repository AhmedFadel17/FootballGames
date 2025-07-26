<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameType extends Model
{
    protected $fillable = ['name', 'description'];

    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }
}