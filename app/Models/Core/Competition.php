<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Competition extends Model
{
    protected $fillable = [
        'name',
        'short_name',
        'country_id',
        'type',
        'founded_year',
        'tier',
        'img_src',
        'popularity',
        'is_active',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function participants()
    {
        return $this->hasMany(CompetitionParticipant::class);
    }

    public function teamStats()
    {
        return $this->hasMany(CompetitionTeamFullStat::class);
    }

    public function playerStats()
    {
        return $this->hasMany(CompetitionPlayerFullStat::class);
    }
}