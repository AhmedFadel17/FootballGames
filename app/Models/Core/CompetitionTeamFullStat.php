<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompetitionTeamFullStat extends Model
{
    use HasFactory;

    /**
     * Table name (optional since it matches Laravel's naming convention)
     */
    protected $table = 'competition_team_full_stats';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'competition_id',
        'team_id',
        'matches_played',
        'wins',
        'draws',
        'losses',
        'goals_for',
        'goals_against',
        'clean_sheets',
        'yellow_cards',
        'red_cards',
        'penalties_scored',
    ];

    /**
     * Relationships
     */

    // Belongs to a competition
    public function competition()
    {
        return $this->belongsTo(Competition::class);
    }

    // Belongs to a team
    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
