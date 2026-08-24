<?php

namespace App\Models\GameEngine;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class GameEntry extends Model
{
    protected $fillable = ['user_id', 'game_instance_id'];
    public function instance(): BelongsTo
    {
        return $this->belongsTo(GameInstance::class, 'game_instance_id');
    }

    public function result(): HasOne
    {
        return $this->hasOne(GameResult::class, 'game_entry_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
