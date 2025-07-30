<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompetitionPlayerFullStat extends Model
{
    use HasFactory;

    /**
     * Table name (optional if matches plural convention)
     */
    protected $table = 'competition_player_full_stats';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'competition_id',
        'player_id',
        'appearances',
        'minutes_played',
        'goals',
        'assists',
        'yellow_cards',
        'red_cards',
        'clean_sheets',
        'saves',
        'penalties_saved',
        'own_goals',
        'goals_conceded',
    ];


    // Belongs to a competition
    public function competition()
    {
        return $this->belongsTo(Competition::class);
    }

    // Belongs to a player
    public function player()
    {
        return $this->belongsTo(Player::class);
    }
}
