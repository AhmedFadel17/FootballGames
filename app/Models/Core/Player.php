<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    protected $fillable = [
        'name',
        'fullname',
        'position',
        'date_of_birth',
        'img_src',
        'api_id',
        'country_id',
    ];

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