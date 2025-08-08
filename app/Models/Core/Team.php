<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Team extends Model
{
    protected $fillable = [
        'name',
        'short_name',
        'abbr',
        'img_src',
        'popularity',
        'api_id',
        'country_id',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function competitionParticipants()
    {
        return $this->hasMany(CompetitionParticipant::class);
    }

    public function competitionTeamFullStats()
    {
        return $this->hasMany(CompetitionTeamFullStat::class);
    }

    // A team can have many players
    public function players()
    {
        return $this->hasMany(Player::class);
    }

}