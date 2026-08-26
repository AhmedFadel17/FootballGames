<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Country
class Country extends Model
{
    protected $fillable = [
        'name',
        'code',
        'popularity',
        'is_federation',
        'img_src',
    ];

    protected $casts = [
        'is_federation' => 'boolean',
        'popularity' => 'integer',
    ];
    public function continent(): BelongsTo
    {
        return $this->belongsTo(Continent::class);
    }

    public function competitions(): HasMany
    {
        return $this->hasMany(Competition::class);
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function players(): HasMany
    {
        return $this->hasMany(Player::class);
    }

    public function managers(): HasMany
    {
        return $this->hasMany(Manager::class);
    }

}