<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Team extends Model
{
    protected $fillable = ['name', 'country_id', 'league_id', 'cup_id'];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    public function cup(): BelongsTo
    {
        return $this->belongsTo(Cup::class);
    }

    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    public function playerPeriods(): HasMany
    {
        return $this->hasMany(PlayerTeamPeriod::class);
    }

    public function managerPeriods(): HasMany
    {
        return $this->hasMany(ManagerTeamPeriod::class);
    }
}