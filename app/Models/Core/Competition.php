<?php

namespace App\Models\Core;

use App\Enums\Core\CompetitionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Competition extends Model
{
    protected $fillable = [
        'name',
        'abbr',
        'country_id',
        'type',
        'founded_year',
        'tier',
        'img_src',
        'popularity',
        'is_active',
        'slug',
        'api_id'
    ];

    protected $casts = [
        'type' => CompetitionType::class,
        'is_active' => 'boolean',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function competitionSeasons()
    {
        return $this->hasMany(CompetitionSeason::class);
    }

}