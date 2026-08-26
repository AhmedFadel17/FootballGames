<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Manager extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'api_id',
        'popularity',
        'country_id',
        'img_src',
        'is_retired',
        'current_team_id',
    ];

    protected $casts = [
        'is_retired' => 'boolean',
    ];

    public function teamPeriods(): HasMany
    {
        return $this->hasMany(ManagerTeamPeriod::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function currentTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'current_team_id');
    }
}