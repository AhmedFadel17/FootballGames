<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Player extends Model
{
    protected $fillable = [
        'name',
        'fullname',
        'position',
        'date_of_birth',
        'img_src',
        'popularity',
        'api_id',
        'country_id',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function competitionPlayerFullStats()
    {
        return $this->hasMany(CompetitionPlayerFullStat::class);
    }

    public function teamPeriods(): HasMany
    {
        return $this->hasMany(PlayerTeamPeriod::class);
    }

    public function transfers(): HasMany
    {
        return $this->hasMany(Transfer::class);
    }
}