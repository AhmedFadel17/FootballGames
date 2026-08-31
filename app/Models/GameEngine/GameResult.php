<?php

namespace App\Models\GameEngine;

use App\Models\User;
use App\Enums\GameEngine\GameResultStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameResult extends Model
{
    protected $fillable = [
        'game_entry_id',
        'score',
        'is_winner',
        'rank',
        'duration_seconds',
        'earned_xp',
        'earned_coins',
        'earned_points',
        'status'
    ];

    protected $casts = [
        'is_winner' => 'boolean',
        'score' => 'integer',
        'rank' => 'integer',
        'duration_seconds' => 'integer',
        'earned_xp' => 'integer',
        'earned_coins' => 'integer',
        'earned_points' => 'integer',
        'status' => GameResultStatus::class,
    ];
    public function entry(): BelongsTo
    {
        return $this->belongsTo(GameEntry::class, 'game_entry_id');
    }

}
