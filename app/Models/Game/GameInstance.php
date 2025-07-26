<?php

namespace App\Models\Game;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameInstance extends Model
{
    protected $fillable = ['game_id', 'start_at', 'end_at'];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(GameEntry::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(GameResult::class);
    }

    public function prizes(): HasMany
    {
        return $this->hasMany(GamePrize::class);
    }
}