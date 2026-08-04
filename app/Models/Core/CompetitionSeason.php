<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompetitionSeason extends Model
{
    use HasFactory;

    protected $fillable = [
        'competition_id',
        'season_id',
        'winner_team_id',
    ];

    public function competition()
    {
        return $this->belongsTo(Competition::class);
    }

    public function season()
    {
        return $this->belongsTo(Season::class);
    }

    public function standings()
    {
        return $this->hasMany(Standing::class)->orderBy('position');
    }

}
