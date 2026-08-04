<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlayerSeasonStat extends Model
{
    protected $fillable = [
        'player_id',
        'team_id',
        'competition_id',
        'season_id',
        'is_detail',
        'appearances',
        'goals',
        'assists',
        'yellow_cards',
        'red_cards',
        'matches_started',
        'matches_from_bench',
        'minutes',
        'age',
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

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function competition(): BelongsTo
    {
        return $this->belongsTo(Competition::class);
    }
}