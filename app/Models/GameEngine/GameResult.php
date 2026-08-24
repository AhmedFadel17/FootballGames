<?php

namespace App\Models\GameEngine;

use App\Models\User;
use App\Enums\GameEngine\GameResultStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameResult extends Model
{
    protected $fillable = ['game_entry_id', 'score', 'is_winner', 'rank', 'status'];

    protected $casts = [
        'status' => GameResultStatus::class,
    ];
    public function entry(): BelongsTo
    {
        return $this->belongsTo(GameEntry::class, 'game_entry_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
