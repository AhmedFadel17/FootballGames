<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Manager extends Model
{
    protected $fillable = ['name', 'slug', 'api_id', 'popularity', 'country_id', 'img_src'];

    public function teamPeriods(): HasMany
    {
        return $this->hasMany(ManagerTeamPeriod::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}