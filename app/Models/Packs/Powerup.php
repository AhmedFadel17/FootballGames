<?php

namespace App\Models\Packs;

use App\Enums\Packs\CardRarity;
use App\Enums\Packs\PowerupType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Powerup extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'type',
        'description',
        'img_src',
        'rarity',
        'duration',
        'multiplier',
    ];

    protected $casts = [
        'type' => PowerupType::class,
        'rarity' => CardRarity::class,
    ];

    public function userPowerups(): HasMany
    {
        return $this->hasMany(UserPowerup::class);
    }
}