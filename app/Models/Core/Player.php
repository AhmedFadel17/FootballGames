<?php

namespace App\Models\Core;

use App\Enums\Core\PlayerPosition;
use App\Enums\Core\PlayerPreferredFoot;
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
        'height_cm',
        'weight_kg',
        'preferred_foot',
        'slug',
        'rating',
        'market_value',
    ];
    protected $casts = [
        'date_of_birth' => 'date',
        'position' => PlayerPosition::class,
        'preferred_foot' => PlayerPreferredFoot::class,
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function teamPeriods(): HasMany
    {
        return $this->hasMany(PlayerTeamPeriod::class);
    }

    public function transfers(): HasMany
    {
        return $this->hasMany(Transfer::class);
    }
    public function careerSeasonStats(): HasMany
    {
        return $this->hasMany(PlayerSeasonStat::class);
    }
    public function careerSummaries(): HasMany
    {
        return $this->hasMany(PlayerCareerSummary::class);
    }
}