<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerCareerSummary extends Model
{
    protected $fillable = [
        'player_id',
        'team_id',
        'appearances',
        'goals',
        'assists',
        'yellow_cards',
        'red_cards',
        'matches_started',
        'matches_from_bench',
        'minutes',
        'points',
        'elo',
    ];

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

}