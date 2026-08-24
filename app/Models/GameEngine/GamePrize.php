<?php

namespace App\Models\GameEngine;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GamePrize extends Model
{
    protected $fillable = ['game_instance_id', 'rank', 'reward'];

    public function instance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class);
    }
}