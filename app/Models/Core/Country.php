<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Country
class Country extends Model
{
    protected $fillable = ['name', 'code'];

    public function leagues(): HasMany
    {
        return $this->hasMany(League::class);
    }

    public function cups(): HasMany
    {
        return $this->hasMany(Cup::class);
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }
}