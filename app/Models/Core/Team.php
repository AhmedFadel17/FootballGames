<?php

namespace App\Models\Core;

use App\Enums\Core\TeamType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Team extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'abbr',
        'img_src',
        'popularity',
        'api_id',
        'country_id',
        'type',
        'current_competition_id',
    ];
    protected $casts = [
        'type' => TeamType::class,
        'popularity' => 'integer',
    ];
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function currentCompetition(): BelongsTo
    {
        return $this->belongsTo(Competition::class, 'current_competition_id');
    }

    public function competitionSeasons(): HasMany
    {
        return $this->hasMany(CompetitionSeason::class);
    }

    public function currentSquad(): HasMany
    {
        return $this->hasMany(Player::class, 'current_team_id');
    }

    public function currentManager(): HasOne
    {
        return $this->hasOne(Manager::class, 'current_team_id');
    }

    public function wonCompetitionSeasons(): HasMany
    {
        return $this->hasMany(CompetitionSeason::class, 'winner_team_id');
    }

    public function standings(): HasMany
    {
        return $this->hasMany(Standing::class, 'team_id');
    }

    public function managerPeriods(): HasMany
    {
        return $this->hasMany(ManagerTeamPeriod::class, 'team_id');
    }
}