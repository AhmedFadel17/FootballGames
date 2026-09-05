<?php

namespace App\Models\Packs;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Powerup extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'icon_src',
    ];

    public function userPowerups(): HasMany
    {
        return $this->hasMany(UserPowerup::class);
    }
}